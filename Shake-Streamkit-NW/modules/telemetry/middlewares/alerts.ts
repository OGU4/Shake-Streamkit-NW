import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import type { DefaultWaveType } from '@/core/utils/wave'
import VoiceAlertManager from '@/core/utils/audio/VoiceAlertManager'
import { addLog, type WaveAlertLog } from '@/notification/slicers'
import type { ShakeDefaultWave } from '@/telemetry/models/data'
import { addTelemetry } from '@/telemetry/slicers'

import type { RootState } from 'app/store'
import type { AlertId } from '@/core/utils/audio/VoiceAlertManager'

const THRESHOLD_IN_SECONDS = 27
const extraPlayers = 4

type FiredWaveMap = Map<DefaultWaveType, Set<number>>
const firedAlerts = new Map<string, FiredWaveMap>()
const firedMatchmaking = new Map<string, boolean>()

type JoeAlertState = {
	firedCountdowns: Set<number>
	firedTargetSwitches: Set<number>
	nextTargetIndex: number
}

const joeAlertStates = new Map<string, JoeAlertState>()

const NEXT_TARGET_ALERTS: Record<number, AlertId> = {
	1: 'joe_nxt1st',
	2: 'joe_nxt2nd',
	3: 'joe_nxt3rd',
	4: 'joe_nxt4th',
}

const hasFired = (matchId: string, wave: DefaultWaveType, threshold: number): boolean => {
	const waveMap = firedAlerts.get(matchId)
	if (!waveMap) {
		return false
	}
	return waveMap.get(wave)?.has(threshold) === true
}

const markFired = (matchId: string, wave: DefaultWaveType, threshold: number): void => {
	let waveMap = firedAlerts.get(matchId)
	if (!waveMap) {
		waveMap = new Map()
		firedAlerts.set(matchId, waveMap)
	}

	let thresholds = waveMap.get(wave)
	if (!thresholds) {
		thresholds = new Set()
		waveMap.set(wave, thresholds)
	}
	thresholds.add(threshold)
}

const getJoeAlertState = (matchId: string): JoeAlertState => {
	let state = joeAlertStates.get(matchId)
	if (!state) {
		state = {
			firedCountdowns: new Set(),
			firedTargetSwitches: new Set(),
			nextTargetIndex: 2,
		}
		joeAlertStates.set(matchId, state)
	}
	return state
}

const telemetryAlertsMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const result = next(action)
	if (!addTelemetry.match(action)) {
		return result
	}

	const state = store.getState()
	const ev = action.payload as any

	if (
		ev.event === 'matchmaking' &&
		state.config.waveAnnouncementsEnabled === true
	) {
		const matchId = ev.session
		if (matchId && firedMatchmaking.has(matchId) === false) {
			firedMatchmaking.set(matchId, true)
			VoiceAlertManager.play('matchmaking_start')
		}
	}

	if (
		ev.event === 'game_update' &&
		ev.wave === 'extra' &&
		state.config.joeAlertEnabled === true
	) {
		const matchId = state.overlay.match
		if (matchId) {
			const count = ev.count
			const joeAlertState = getJoeAlertState(matchId)

			if (typeof count === 'number' && count >= 24 && count <= 94 && count % 10 === 4) {
				if (!joeAlertState.firedTargetSwitches.has(count)) {
					joeAlertState.firedTargetSwitches.add(count)
					const currentTargetIndex = joeAlertState.nextTargetIndex
					const alertId = NEXT_TARGET_ALERTS[currentTargetIndex]
					joeAlertState.nextTargetIndex = (currentTargetIndex % extraPlayers) + 1
					if (alertId) {
						VoiceAlertManager.play(alertId)
					}
				}
			}

			if (typeof count === 'number' && count >= 20 && count <= 100 && count % 10 === 0) {
				if (!joeAlertState.firedCountdowns.has(count)) {
					joeAlertState.firedCountdowns.add(count)
					VoiceAlertManager.play('joe_alert_countdown')
				}
			}
		}
	}

	const lastSpawnAlertEnabled = state.config.lastSpawnAlertEnabled
	if (lastSpawnAlertEnabled === false) {
		return result
	}

	const matchId = state.overlay.match
	if (!matchId) {
		return result
	}

	const telemetry = state.telemetry.entities[matchId]
	if (!telemetry) {
		return result
	}

	const latestWaveKey = telemetry.waveKeys.findLast(waveKey => waveKey !== 'extra')
	if (!latestWaveKey) {
		return result
	}

	const waveData = telemetry.waves[latestWaveKey] as ShakeDefaultWave | undefined
	if (!waveData) {
		return result
	}

	const updates = waveData.updates
	if (updates.length === 0) {
		return result
	}

	const latestUpdate = updates.at(-1)
	if (!latestUpdate) {
		return result
	}
	const previousUpdate = updates.at(-2)

	const latestCount = latestUpdate.count
	const previousCount = previousUpdate?.count

	if (latestCount > THRESHOLD_IN_SECONDS) {
		return result
	}
	if (previousCount !== undefined && previousCount <= THRESHOLD_IN_SECONDS) {
		return result
	}
	if (hasFired(matchId, waveData.wave, THRESHOLD_IN_SECONDS)) {
		return result
	}

	markFired(matchId, waveData.wave, THRESHOLD_IN_SECONDS)

	// Play Zunda 20s alert voice when the threshold is hit.
	VoiceAlertManager.play('wave_20sec')

	const log: WaveAlertLog = {
		type: 'wave_alert',
		timestamp: Date.now(),
		matchId,
		wave: waveData.wave,
		threshold: THRESHOLD_IN_SECONDS,
		message: `Session ${matchId} wave ${waveData.wave} is now <= ${THRESHOLD_IN_SECONDS}s.`,
	}
	store.dispatch(addLog(log))

	return result
}

export default telemetryAlertsMiddleware
