import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import type { DefaultWaveType } from '@/core/utils/wave'
import VoiceAlertManager from '@/core/utils/audio/VoiceAlertManager'
import { addLog, type WaveAlertLog } from '@/notification/slicers'
import type { ShakeDefaultWave } from '@/telemetry/models/data'
import { addTelemetry } from '@/telemetry/slicers'

import type { RootState } from 'app/store'

const THRESHOLD_IN_SECONDS = 27

type FiredWaveMap = Map<DefaultWaveType, Set<number>>
const firedAlerts = new Map<string, FiredWaveMap>()

const joeFiredAlerts = new Map<string, Set<number>>()

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

const hasFiredJoe = (matchId: string, threshold: number): boolean => {
	const thresholds = joeFiredAlerts.get(matchId)
	if (!thresholds) {
		return false
	}
	return thresholds.has(threshold)
}

const markFiredJoe = (matchId: string, threshold: number): void => {
	let thresholds = joeFiredAlerts.get(matchId)
	if (!thresholds) {
		thresholds = new Set()
		joeFiredAlerts.set(matchId, thresholds)
	}
	thresholds.add(threshold)
}

const telemetryAlertsMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const result = next(action)
	if (!addTelemetry.match(action)) {
		return result
	}

	const state = store.getState()

	// Extra wave Joe alert countdown
	if (state.config.joeAlertEnabled === true) {
		const ev = action.payload as any
		if (ev.event === 'game_update' && ev.wave === 'extra') {
			const matchId = state.overlay.match
			if (matchId) {
				const count = ev.count
				if (typeof count === 'number' && count >= 20 && count <= 100 && count % 10 === 0) {
					if (!hasFiredJoe(matchId, count)) {
						markFiredJoe(matchId, count)
						VoiceAlertManager.play('joe_alert_countdown')
					}
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
