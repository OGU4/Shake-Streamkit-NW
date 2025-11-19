enum CounterAnomalyDetectorState {
	IdleStart = 1,
	IdleEnd = 2,
	CountDown = 3,
}

export class CounterAnomalyDetector {
	#state: CounterAnomalyDetectorState = CounterAnomalyDetectorState.IdleStart
	#prevValue = 100
	#prevTimestamp = 0

	reset(): void {
		this.#state = CounterAnomalyDetectorState.IdleStart
		this.#prevValue = 100
		this.#prevTimestamp = 0
	}

	isAnomalous(value: number, timestamp: number): boolean {
		switch (this.#state) {
		case CounterAnomalyDetectorState.CountDown: {
			const diffValue = this.#prevValue - value
			const diffTimestamp = Math.ceil(0.25 + timestamp - this.#prevTimestamp)
			if (diffValue < 0 || diffValue > diffTimestamp) {
				return true
			}

			if (value <= 0 || value >= 1000) {
				this.#state = CounterAnomalyDetectorState.IdleEnd
			}
			break
		}
		case CounterAnomalyDetectorState.IdleStart:
			if (value < 100) {
				this.#state = CounterAnomalyDetectorState.CountDown
			}
			break
		case CounterAnomalyDetectorState.IdleEnd:
			if (value !== 0) {
				return true
			}
			break
		}

		// Update values
		this.#prevValue = value
		this.#prevTimestamp = timestamp

		return false
	}
}
