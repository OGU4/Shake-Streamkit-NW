import { setMatch } from '@/overlay/slicers'

import { AppDispatch } from 'app/store'

import { ShakeEvent } from '../models/telemetry'
import { addTelemetry } from '../slicers'

export class RealtimeTelemetrySimulator {
	#dispatch: AppDispatch
	#rate: number
	#baseTimestamp: number = 0
	#telemetry: Readonly<ShakeEvent>[] = []
	#timerId: number = 0

	constructor(dispatch: AppDispatch, speed: number = 1.0) {
		this.#dispatch = dispatch
		this.#rate = 1.0 / speed
	}

	get rate(): number {
		return this.#rate
	}

	#handleEvent(t: Readonly<ShakeEvent>) {
		this.#dispatch(addTelemetry(t))
		this.#setNextTelemetry(this.#telemetry.shift())
	}

	#setNextTelemetry(t: Readonly<ShakeEvent> | undefined) {
		if (t === undefined) {
			return
		}

		const delay = 1000 * this.#rate * (t.timestamp - this.#baseTimestamp)
		this.#baseTimestamp = t.timestamp
		this.#timerId = window.setTimeout(this.#handleEvent.bind(this, t), delay)
	}

	play(telemetry: Readonly<ShakeEvent>[]) {
		if (this.#timerId !== 0) {
			window.clearTimeout(this.#timerId)
			this.#timerId = 0
		}
		if (telemetry.length === 0) {
			return
		}

		this.#baseTimestamp = telemetry[0].timestamp
		this.#telemetry = telemetry

		const firstTelemetry = telemetry.shift()
		if (firstTelemetry !== undefined) {
			this.#dispatch(addTelemetry(firstTelemetry))
			this.#dispatch(setMatch(firstTelemetry.session))
			this.#setNextTelemetry(this.#telemetry.shift())
		}
	}
}
