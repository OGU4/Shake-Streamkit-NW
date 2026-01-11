import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { isDefaultWave } from '@/core/utils/wave'
import { addTelemetry } from '@/telemetry/slicers'
import { tick as tickShadowCounter } from '@/shadowCounter/slicers'

import type { RootState } from 'app/store'

import type { ScriptWaveId } from '../models/storage'
import { parseScript } from '../utils/parser'
import { cancelSpeech, speakText } from '../utils/speech'

type FiredState = {
	wave?: number
	fired: Set<string>
}

const sessions = new Map<string, FiredState>()
let lastMatchId: string | undefined

const ensureSession = (matchId: string): FiredState => {
	let state = sessions.get(matchId)
	if (!state) {
		state = { fired: new Set() }
		sessions.set(matchId, state)
	}
	return state
}

const scriptSpeechMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const result = next(action)

	if (!addTelemetry.match(action) && !tickShadowCounter.match(action)) {
		return result
	}

	const state = store.getState()
	if (state.script.enabled !== true) {
		cancelSpeech()
		return result
	}

	const matchId = state.overlay.match
	if (!matchId) {
		cancelSpeech()
		return result
	}

	if (lastMatchId && lastMatchId !== matchId) {
		cancelSpeech()
	}
	lastMatchId = matchId

	const telemetry = state.telemetry.entities[matchId]
	if (!telemetry) {
		return result
	}

	const latestWaveKey = telemetry.waveKeys.findLast(waveKey => waveKey !== 'extra')
	if (!latestWaveKey || !isDefaultWave(latestWaveKey)) {
		cancelSpeech()
		return result
	}

	const waveData = telemetry.waves[latestWaveKey]
	if (!waveData || !('updates' in waveData)) {
		return result
	}

	const updates = waveData.updates
	const shadow = state.shadowCounter
	const useShadow = shadow.running === true && shadow.wave === waveData.wave
	if (!useShadow && (!updates || updates.length < 2)) {
		return result
	}

	const latestUpdate = updates.at(-1)
	const previousUpdate = updates.at(-2)
	if (!latestUpdate || (!useShadow && !previousUpdate)) {
		return result
	}

	let latestCount = latestUpdate?.count
	let previousCount = previousUpdate?.count
	if (useShadow) {
		latestCount = shadow.value
		previousCount = shadow.prevValue ?? shadow.value
	}
	if (typeof latestCount !== 'number' || typeof previousCount !== 'number') {
		return result
	}
	const session = ensureSession(matchId)
	if (session.wave !== waveData.wave) {
		session.wave = waveData.wave
		session.fired.clear()
		cancelSpeech()
	}

	const waveId = `Wave${waveData.wave}` as ScriptWaveId
	const scriptText = state.script.waves[waveId] ?? ''
	const entries = parseScript(waveId, scriptText)

	for (const entry of entries) {
		const key = `${entry.waveId}:${entry.lineIndex}`
		if (session.fired.has(key)) {
			continue
		}
		if (previousCount !== entry.targetCount && latestCount === entry.targetCount) {
			session.fired.add(key)
			speakText(entry.text, state.script.volume, state.script.voice)
		}
	}

	return result
}

export default scriptSpeechMiddleware
