export const forceLast = <T>(arr: T[]): T => arr[arr.length - 1]

export function isEqual<T>(arr1: T[], arr2: T[]): boolean {
	return arr1.length === arr2.length
		&& arr1.reduce((flag, val, index) => flag && arr2[index] === val, true)
}

export function initCollection() {
	Object.defineProperty(Array.prototype, 'last', {
		get(): any | undefined {
			return this.at(-1)
		},
	})

	Array.prototype.equals = function (other: any[]): boolean {
		return isEqual(this, other)
	}

	// toSorted() from Chrome 110+, Safari 16+, and Firefox 115
	if (Array.prototype.toSorted === undefined) {
		Array.prototype.toSorted = function (compareFn?: ((a: any, b: any) => number) | undefined) {
			return this.slice(0).sort(compareFn)
		}
	}
}

export default initCollection
