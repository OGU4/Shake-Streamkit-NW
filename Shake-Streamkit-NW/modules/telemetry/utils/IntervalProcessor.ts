export class IntervalProcessor {
	readonly #intervals: (readonly [number, number])[] = []

	#startTimestamp: number | undefined = undefined
	#totalDuration: number = 0

	reset(): IntervalProcessor {
		this.#intervals.length = 0
		this.#startTimestamp = undefined
		this.#totalDuration = 0
		return this
	}

	finalize(timestamp: number): void {
		if (this.#startTimestamp !== undefined) {
			const timestamps = Object.freeze([this.#startTimestamp, timestamp] satisfies [number, number])
			this.#intervals.push(timestamps)
			this.#totalDuration += timestamp - this.#startTimestamp
			this.#startTimestamp = undefined
		}
	}

	add(timestamp: number, entry: boolean): IntervalProcessor {
		if (entry) {
			if (this.#startTimestamp === undefined) {
				this.#startTimestamp = timestamp
			}
		} else {
			this.finalize(timestamp)
		}
		return this
	}

	get(timestamp: number): readonly (readonly [number, number])[] {
		if (this.#startTimestamp === undefined) {
			return this.#intervals.slice(0)
		}

		const intervals = this.#intervals.slice(0)
		const timestamps = Object.freeze([this.#startTimestamp, timestamp] satisfies [number, number])
		intervals.push(timestamps)
		return intervals
	}

	get intervals(): readonly (readonly [number, number])[] {
		return this.#intervals
	}

	get totalDuration(): number {
		return this.#totalDuration
	}
}
