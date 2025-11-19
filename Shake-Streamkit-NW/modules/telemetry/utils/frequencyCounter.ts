export class FrequencyCounter<T> {
	readonly #frequencyMap: Map<T, number>

	#mode: T | undefined
	#maxFrequency: number

	constructor(initialValue?: T) {
		this.#frequencyMap = new Map()
		if (initialValue) {
			this.#mode = initialValue
			this.#maxFrequency = 1
		} else {
			this.#mode = undefined
			this.#maxFrequency = 0
		}
	}

	add(data: T): FrequencyCounter<T> {
		const currentFrequency = this.#frequencyMap.get(data) || 0
		const newFrequency = currentFrequency + 1
		this.#frequencyMap.set(data, newFrequency)

		if (newFrequency > this.#maxFrequency) {
			this.#maxFrequency = newFrequency
			this.#mode = data
		} else if (newFrequency === this.#maxFrequency) {
			this.#mode = data
		}

		return this
	}

	reset(initialValue?: T) {
		this.#frequencyMap.clear()
		if (initialValue) {
			this.#mode = initialValue
			this.#maxFrequency = 1
		} else {
			this.#mode = undefined
			this.#maxFrequency = 0
		}
	}

	get mode(): T {
		if (this.#mode === undefined) {
			throw Error('Mode value is undefined.')
		}
		return this.#mode
	}
}
