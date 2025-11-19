export type FlexibleWaveType = undefined | null | number | string

export type DefaultWaveType = 1 | 2 | 3 | 4 | 5

type NumberToString<N extends number> = `${N}`

export type DefaultWaveStringType = NumberToString<DefaultWaveType>

export type WaveType = DefaultWaveType | 'extra'

export type WaveStringType = DefaultWaveStringType | 'extra'

export const isDefaultWave = (val: FlexibleWaveType): val is DefaultWaveType => {
	return typeof val === 'number' && 1 <= val && val <= 5
}

export const toDefaultWave = (val: FlexibleWaveType): DefaultWaveType => {
	switch (typeof val) {
	case 'string':
		throw Error('string cannot permit')
	case 'number':
		if (1 < val || val > 5) {
			throw Error('invalid number')
		}
		break
	}
	return val as DefaultWaveType
}

export const isWave = (val: FlexibleWaveType): val is WaveType => {
	switch (typeof val) {
	case 'number':
		return 1 <= val && val <= 5
	case 'string':
		return val === 'extra'
	}
	return false
}

export const toWave = (val: FlexibleWaveType): WaveType => {
	switch (typeof val) {
	case 'number':
		if (1 < val || val > 5) {
			throw Error('invalid number')
		}
		break
	case 'string':
		if (val !== 'extra') {
			throw Error('invalid string')
		}
		break
	}
	return val as WaveType
}
