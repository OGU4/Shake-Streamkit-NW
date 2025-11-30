import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { forceLast } from '@/core/utils/collection'
import { addOomonAlert, hideEggGraphDelayed, setOomonNextSpawnIndex, setOomonSchedule, showEggGraph, showPoweredby } from '@/overlay/slicers'
import { getCurrentTelemetry, getCurrentWaveFromTelemetry } from '@/overlay/selector'
import type { ShakeDefaultWave } from '@/telemetry/models/data'
import { addTelemetry } from '@/telemetry/slicers'
import { getOomonSpawnScheduleForWave } from '@/telemetry/utils/oomonIntervals'
import type { ShakeGameUpdateEvent } from '@/telemetry/models/telemetry'

import type { RootState } from 'app/store'

const DEBUG_OOMON_ALERT = false

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

	// Populate Oomon spawn schedule once when enabled and Wave1 quota is known.
	if (inAddTelemetry && state.overlay.oomonScheduleEnabled && state.overlay.oomonSchedule === undefined) {
		const ev = action.payload as ShakeGameUpdateEvent
		if (ev.event !== 'game_update') {
			return result
		}

		if (ev.wave === 'extra') {
			// EXTRA Wave: skip Oomon spawn schedule/alerts entirely.
			return result
		}

		if (ev.wave === 1 && typeof ev.quota === 'number') {
			const schedule = getOomonSpawnScheduleForWave(1, ev.quota)
			if (schedule === undefined) {
				// Unsupported wave/quota (e.g., table missing or invalid quota) — skip; logging/UI handling is deferred.
			} else {
				store.dispatch(setOomonSchedule(schedule))
			}
		}
	}

	if (inAddTelemetry) {
		const telemetry = getCurrentTelemetry(state)
		const currentWave = getCurrentWaveFromTelemetry(state, telemetry)
		if (!currentWave) {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard A: currentWave is undefined', {
					wave: currentWave?.wave,
					quota: (currentWave as any)?.quota,
					remaining: action.payload.count,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: state.overlay.oomonSchedule?.spawnTimesRemaining.length,
					oomonNextSpawnIndex: state.overlay.oomonNextSpawnIndex,
					spawnTime: state.overlay.oomonSchedule?.spawnTimesRemaining[state.overlay.oomonNextSpawnIndex],
				})
			}
			return result
		}

		if (currentWave.wave === 'extra') {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard B: extra wave', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining: action.payload.count,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: state.overlay.oomonSchedule?.spawnTimesRemaining.length,
					oomonNextSpawnIndex: state.overlay.oomonNextSpawnIndex,
					spawnTime: state.overlay.oomonSchedule?.spawnTimesRemaining[state.overlay.oomonNextSpawnIndex],
				})
			}
			return result
		}

		const oomonSchedule = state.overlay.oomonSchedule
		const oomonNextSpawnIndex = state.overlay.oomonNextSpawnIndex
		const remaining = action.payload.count
		const spawnTimesRemaining = oomonSchedule?.spawnTimesRemaining

		if (oomonSchedule === undefined) {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard C: oomonSchedule is undefined', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: spawnTimesRemaining?.length,
					oomonNextSpawnIndex,
					spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				})
			}
			return result
		}

		if (state.overlay.oomonScheduleEnabled === false) {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard D: oomonSchedule is disabled', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: spawnTimesRemaining?.length,
					oomonNextSpawnIndex,
					spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				})
			}
			return result
		}

		if (oomonNextSpawnIndex >= oomonSchedule.spawnTimesRemaining.length) {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard E: oomonNextSpawnIndex is out of range', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: spawnTimesRemaining?.length,
					oomonNextSpawnIndex,
					spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				})
			}
			return result
		}

		if (typeof currentWave.wave !== 'number') {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard F: wave is not a number', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: spawnTimesRemaining?.length,
					oomonNextSpawnIndex,
					spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				})
			}
			return result
		}

		if (typeof remaining !== 'number') {
			if (DEBUG_OOMON_ALERT) {
				console.log('[oomon-alert] guard G: remaining is not a number', {
					wave: currentWave.wave,
					quota: (currentWave as any).quota,
					remaining,
					oomonScheduleEnabled: state.overlay.oomonScheduleEnabled,
					spawnTimesLength: spawnTimesRemaining?.length,
					oomonNextSpawnIndex,
					spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				})
			}
			return result
		}

		const spawn = oomonSchedule.spawnTimesRemaining[oomonNextSpawnIndex]
		const alertTime = spawn + 4

		if (DEBUG_OOMON_ALERT) {
			console.log('[oomon-alert] check alert', {
				wave: currentWave.wave,
				quota: (currentWave as any).quota,
				remaining,
				oomonNextSpawnIndex,
				spawnTime: spawnTimesRemaining?.[oomonNextSpawnIndex],
				alertTime,
				alertDiff: alertTime - remaining,
			})
		}

		if (alertTime > 100) {
			store.dispatch(setOomonNextSpawnIndex(oomonNextSpawnIndex + 1))
			return result
		}

		if (alertTime === remaining) {
			const nextSpawnRemaining = oomonSchedule.spawnTimesRemaining[oomonNextSpawnIndex + 1] ?? null
			const isLast = nextSpawnRemaining === null

			store.dispatch(addOomonAlert({
				alertRemaining: remaining,
				spawnRemaining: spawn,
				nextSpawnRemaining,
				isLast,
				wave: currentWave.wave,
			}))
			store.dispatch(setOomonNextSpawnIndex(oomonNextSpawnIndex + 1))
		}
	}
	return result
}

export default overlay
