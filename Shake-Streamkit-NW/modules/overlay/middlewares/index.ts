import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { forceLast } from '@/core/utils/collection'
import { hideEggGraphDelayed, showEggGraph, showPoweredby } from '@/overlay/slicers'
import type { ShakeDefaultWave } from '@/telemetry/models/data'
import { addTelemetry } from '@/telemetry/slicers'

import type { RootState } from 'app/store'

const overlay = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: UnknownAction) => {
	const result = next(action)
	const state = store.getState()

	// Return when match is not selected
	const matchId = state.overlay.match
	if (matchId === undefined) {
		return result
	}

	// Return when match is not found
	const currentSession = state.telemetry.entities[matchId]
	if (currentSession === undefined) {
		return result
	}

	// Show powered-by and return if closed when realtime,
	// or return when not realtime
	const inAddTelemetry = addTelemetry.match(action)
	if (currentSession.closed) {
		if (inAddTelemetry) {
			store.dispatch(showPoweredby() as any)
		}
		return result
	}

	if (!state.overlay.wave) {
		// Whether to notify upon quota met
		const notifyOnQuotaMet = state.config.notifyOnQuotaMet === true

		// Whether to notify upon wave finished
		const notifyOnWaveFinished = state.config.notifyOnWaveFinished !== false

		const notify = notifyOnQuotaMet || notifyOnWaveFinished
		if (notify && inAddTelemetry) {
			const latestWaveKey = currentSession.waveKeys.findLast(waveKey => waveKey !== 'extra')
			if (latestWaveKey) {
				const latestWave = currentSession.waves[latestWaveKey] as ShakeDefaultWave
				const latestUpdate = forceLast(latestWave.updates)

				// Notify upon quota met or wave finished
				let waveFinished = notifyOnWaveFinished && latestUpdate.count === 0
				let quotaMet = notifyOnQuotaMet && latestUpdate.amount >= latestWave.quota
				if (waveFinished || quotaMet) {
					const previousUpdate = latestWave.updates.at(-2)
					if (previousUpdate) {
						if (waveFinished) {
							waveFinished = previousUpdate.count !== 0 ? true : false
						}
						if (quotaMet) {
							quotaMet = previousUpdate.amount < latestWave.quota ? true : false
						}
					} else {
						waveFinished = false
						quotaMet = false
					}
				}

				if (waveFinished || quotaMet) {
					store.dispatch(showEggGraph(latestWave.wave))

					// Whether to hide overlay automatically
					const autoHide = state.config.autoHide !== false
					if (autoHide) {
						const delayInSeconds = waveFinished
							? state.config.notifyOnWaveFinishedDuration ?? 12
							: state.config.notifyOnQuotaMetDuration ?? 3
						store.dispatch(hideEggGraphDelayed(delayInSeconds) as any)
					}
				}
			}
		}
	}
	return result
}

export default overlay
