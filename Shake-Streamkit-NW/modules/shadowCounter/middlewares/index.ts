import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { isDefaultWave } from '@/core/utils/wave'
import { addTelemetry } from '@/telemetry/slicers'

import type { RootState } from 'app/store'

import type { ShakeEvent, ShakeGameUpdateEvent } from '@/telemetry/models/telemetry'
import { start, stop, tick } from '../slicers'

const DEBUG_SHADOW_COUNTER = false

let timerId: number | undefined

const clearTimer = () => {
	if (timerId !== undefined) {
		window.clearInterval(timerId)
		timerId = undefined
	}
}

const stopCounter = (store: MiddlewareAPI<Dispatch, RootState>) => {
	clearTimer()
	store.dispatch(stop())
}

const startCounter = (store: MiddlewareAPI<Dispatch, RootState>, wave: number) => {
	clearTimer()
	store.dispatch(start({ wave }))
	timerId = window.setInterval(() => {
		if (DEBUG_SHADOW_COUNTER === true) {
			console.log('[ShadowCounterTick]')
		}
		store.dispatch(tick())
	}, 1000)
}

const shadowCounterMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const result = next(action)
	const state = store.getState()
	const shadow = state.shadowCounter
	const overlayMatch = state.overlay.match

	if (addTelemetry.match(action)) {
		const ev = action.payload as ShakeEvent
		if (ev.event === 'game_result' && shadow.running) {
			stopCounter(store)
			return result
		}

		if (ev.event === 'game_update') {
			const updateEv = ev as ShakeGameUpdateEvent
			const isMatch = overlayMatch && overlayMatch === ev.session
			const isWave = isDefaultWave(updateEv.wave)
			const telemetry = overlayMatch ? state.telemetry.entities[overlayMatch] : undefined
			const waveData = isMatch && telemetry ? telemetry.waves[updateEv.wave] : undefined
			const updatesLength = waveData && 'updates' in waveData ? waveData.updates.length : undefined
			const shouldStart = Boolean(isMatch && isWave && waveData && 'updates' in waveData && updatesLength === 1)
			let startCalled = false
			let runningAfterStart = false
			if (shouldStart) {
				startCounter(store, updateEv.wave)
				startCalled = true
				runningAfterStart = store.getState().shadowCounter.running === true
			}
				if (DEBUG_SHADOW_COUNTER) {
					const latestShadow = store.getState().shadowCounter
					console.log('[ShadowCounter]', {
						overlayMatch: overlayMatch ?? null,
						shadowValue: latestShadow.value,
						shadowPrevValue: latestShadow.prevValue ?? null,
						event: ev.event,
						evSession: ev.session,
						evWave: updateEv.wave,
					updatesLength,
					result: shouldStart ? 'start' : 'no start',
					startCalled,
					runningAfterStart,
				})
			}
		}
	}

	const latestShadow = store.getState().shadowCounter
	if (latestShadow.value === 0 && timerId !== undefined) {
		stopCounter(store)
	}

	return result
}

export default shadowCounterMiddleware
