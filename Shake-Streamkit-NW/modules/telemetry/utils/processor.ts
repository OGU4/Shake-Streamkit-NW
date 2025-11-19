import { type WaveType, isDefaultWave } from '@/core/utils/wave'

import { CounterAnomalyDetector } from './CounterAnomalyDetector'
import { IntervalProcessor } from './IntervalProcessor'
import { FrequencyCounter } from './frequencyCounter'

import type { ShakeBaseWave, ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry, ShakeUpdate } from '../models/data'
import type { ShakeEvent, ShakeGameKingEvent, ShakeGameUpdateEvent } from '../models/telemetry'

export class TelemetryProcessor {
	readonly #maxIncreaseAmountInSeconds: number

	// New context flag
	#newContext: boolean = true

	// Data processing instances
	readonly #quotaCounter: FrequencyCounter<number> = new FrequencyCounter()
	readonly #countAnomalyDetector: CounterAnomalyDetector = new CounterAnomalyDetector()
	readonly #players: readonly [IntervalProcessor, IntervalProcessor][] = [
		[new IntervalProcessor(), new IntervalProcessor()],
		[new IntervalProcessor(), new IntervalProcessor()],
		[new IntervalProcessor(), new IntervalProcessor()],
		[new IntervalProcessor(), new IntervalProcessor()],
	]

	// Base count; use this value as base of this.#waveData.startTimestamp
	#baseCount: number = 110

	// Current wave
	#currentWave: WaveType | undefined = undefined

	// Raw event storage
	readonly #storage: ShakeEvent[] = []

	// Telemetry data
	#data: ShakeTelemetry = undefined as any
	#waveData: ShakeBaseWave = undefined as any

	constructor(maxIncreaseAmountInSeconds: number) {
		this.#maxIncreaseAmountInSeconds = maxIncreaseAmountInSeconds
	}

	resetContext(ev?: Readonly<ShakeEvent>) {
		// Finalize previous data
		if (this.#data && this.#data.closed === undefined) {
			this.#data.closed = 'unknown'
		}

		// Return if ev is undefined
		if (ev === undefined) {
			return
		}

		// Reset initial state
		this.#newContext = true

		this.#countAnomalyDetector.reset()
		this.#quotaCounter.reset()
		this.#players.forEach(function ([alive, gegg]) {
			alive.reset()
			gegg.reset()
		})
		this.#baseCount = 110
		this.#currentWave = undefined

		this.#storage.length = 0
		this.#data = {
			id: ev.session,
			timestamp: ev.timestamp,
			waveKeys: [],
			waves: {},
		}
		this.#waveData = undefined as any
	}

	#processInitExtra(ev: Readonly<ShakeGameKingEvent>) {
		this.#countAnomalyDetector.reset()
		this.#baseCount = 100
		this.#currentWave = 'extra'

		// Create new wave data
		const newWaveData: ShakeExtraWave = {
			wave: 'extra',
			king: ev.king,
			startTimestamp: ev.timestamp,
			players: this.#players.map(function ([alive, gegg], index) {
				return {
					index,
					alives: alive.reset().add(ev.timestamp, true).get(ev.timestamp),
					geggs: gegg.reset().add(ev.timestamp, false).get(ev.timestamp),
				}
			}),
		} as const
		this.#data.waveKeys.push('extra')
		this.#data.waves['extra'] = newWaveData
		this.#waveData = newWaveData
	}

	#processUpdateExtra(ev: Readonly<ShakeGameUpdateEvent>) {
		if (ev.count === undefined) {
			return // DISPOSE!!
		}

		// Update wave
		const currentWaveData = this.#waveData as ShakeExtraWave

		// Update quota and status
		this.#players.forEach(function ([alive, gegg], index) {
			const pev = ev.players[index]
			currentWaveData.players[index] = {
				index,
				alives: alive.add(ev.timestamp, pev.alive).get(ev.timestamp),
				geggs: gegg.add(ev.timestamp, pev.gegg).get(ev.timestamp),
			}
		})
	}

	#processUpdate(ev: Readonly<ShakeGameUpdateEvent>) {
		// Extra wave
		if (ev.wave === 'extra') {
			this.#processUpdateExtra(ev)
			return
		}
		if (this.#currentWave === 'extra') {
			throw Error('Current wave is extra.')
		}

		// Set color
		if (this.#currentWave === undefined) {
			this.#data.color = ev.color
		}

		// Detect new wave from telemetry
		let currentWave = this.#currentWave
		if (this.#currentWave !== ev.wave && this.#waveData !== undefined) {
			// N sec have not elapsed since base time
			const diffTimestamp = ev.timestamp - this.#waveData.startTimestamp
			if (diffTimestamp <= this.#baseCount) {
				currentWave = this.#currentWave  // Restore
			} else if (isDefaultWave(ev.wave)) {
				// The "wave" is clearly strange
				const nextWave = this.#currentWave! + Math.min(5, Math.floor(diffTimestamp / 108))
				if (ev.wave < this.#currentWave! || ev.wave > nextWave) {
					return // DISPOSE!!
				}
				currentWave = ev.wave
			} else {
				return // DISPOSE!!
			}
		} else if (isDefaultWave(ev.wave)) {
			currentWave = ev.wave
		} else {
			return // DISPOSE!!
		}

		if (this.#currentWave !== currentWave) {
			if (ev.count === undefined) {
				return // DISPOSE!!
			}

			this.#countAnomalyDetector.reset()
			this.#quotaCounter.reset(ev.quota)
			this.#baseCount = ev.count
			this.#currentWave = currentWave

			// Create new wave data
			const newWaveData: ShakeDefaultWave = {
				wave: currentWave!,
				startTimestamp: ev.timestamp,
				amount: ev.amount ?? 0 /* MAYBE 0 */,
				quota: this.#quotaCounter.mode,
				updates: [
					Object.freeze({
						timestamp: ev.timestamp,
						count: ev.count,
						amount: ev.amount ?? 0 /* MAYBE 0 */,
						players: ev.players,
						unstable: ev.unstable,
					}),
				],
				players: this.#players.map(function ([alive, gegg], index) {
					const pev = ev.players[index]
					return {
						index,
						alives: alive.reset().add(ev.timestamp, pev.alive).get(ev.timestamp),
						geggs: gegg.reset().add(ev.timestamp, pev.gegg).get(ev.timestamp),
					}
				}),
			} as const
			this.#data.waveKeys.push(currentWave!)
			this.#data.waves[currentWave!] = newWaveData
			this.#waveData = newWaveData
			return
		}

		// Update wave
		const currentWaveData = this.#waveData as ShakeDefaultWave

		let count = ev.count
		if (count === undefined) {
			// Calc count
			count = Math.floor(100 + currentWaveData.startTimestamp - ev.timestamp)
		} else {
			const isAnomalous = this.#countAnomalyDetector.isAnomalous(count, ev.timestamp)
			if (isAnomalous) {
				// Correct count
				count = Math.floor(100 + currentWaveData.startTimestamp - ev.timestamp)
			} else {
				// Update timestamp
				switch (count) {
				case 0:
					if (currentWaveData.endTimestamp === undefined) {
						this.#baseCount = 0
						currentWaveData.startTimestamp = ev.timestamp - 100
						currentWaveData.endTimestamp = ev.timestamp
					}
					break
				default:
					if (this.#baseCount >= 100) {
						this.#baseCount = count
						currentWaveData.startTimestamp = ev.timestamp - (100 - count)
					}
					break
				}
			}
		}

		// Update quota and status
		currentWaveData.quota = this.#quotaCounter.add(ev.quota).mode
		this.#players.forEach(function ([alive, gegg], index) {
			const pev = ev.players[index]
			currentWaveData.players[index] = {
				index,
				alives: alive.add(ev.timestamp, pev.alive).get(ev.timestamp),
				geggs: gegg.add(ev.timestamp, pev.gegg).get(ev.timestamp),
			}
		})

		// Check diff >= 0
		const lastUpdate = currentWaveData.updates.at(-1)
		if (lastUpdate === undefined) {
			throw Error('Wave update is empty.')
		}

		if (ev.amount === undefined) {
			return // DISPOSE!!
		}

		const diffAmount = ev.amount - lastUpdate.amount
		if (diffAmount < 0) {
			return // DISPOSE!!
		}

		// Check diff < allowed
		const elapsedTime = ev.timestamp - lastUpdate.timestamp
		const allowedIncrase = elapsedTime * this.#maxIncreaseAmountInSeconds
		if (diffAmount > allowedIncrase) {
			return // DISPOSE!!
		}

		// Update amount to wave data
		currentWaveData.amount = ev.amount

		// Create new update data
		const newUpdateData: ShakeUpdate = Object.freeze({
			timestamp: ev.timestamp,
			count,
			amount: ev.amount,
			players: ev.players,
			unstable: ev.unstable,
		})
		currentWaveData.updates.push(newUpdateData)
	}

	process(ev: Readonly<ShakeEvent>) {
		// Reset context when matchmaking or different session ID
		if (ev.event === 'matchmaking' || ev.session !== this.#data?.id) {
			this.resetContext(ev)
		}

		// Insert data to storage
		this.#storage.push(ev)

		// Check finalized flag
		if (this.#data.closed) {
			throw Error('Current context is closed.')
		}

		switch (ev.event) {
		case 'game_update':
			this.#processUpdate(ev)
			break
		case 'game_result':
			this.#data.closed = 'unknown'
			this.#data.power = ev.power
			break
		case 'game_error':
			this.#data.closed = 'network'
			break
		case 'game_stage':
			this.#data.stage = ev.stage
			break
		case 'game_king':
			this.#processInitExtra(ev)
			break
		}
	}

	// Check new context
	isNewContext(): boolean {
		if (this.#newContext) {
			this.#newContext = false
			return true
		}
		return false
	}

	// Current Telemetry
	get current(): ShakeTelemetry {
		return this.#data
	}
}
