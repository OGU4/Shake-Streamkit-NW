import { DefaultWaveStringType, DefaultWaveType, WaveType } from '@/core/utils/wave'

import { ShakeCloseReason, ShakeColor, ShakeKing, ShakeStage } from './constant'

export interface ShakePlayerStatus {
	readonly alive: boolean
	readonly gegg: boolean
}

export interface ShakeUpdate {
	readonly timestamp: number
	readonly count: number
	readonly amount: number
	readonly players: ShakePlayerStatus[]
	readonly unstable: boolean
}

export interface ShakePlayerWave {
	readonly index: number
	readonly alives: readonly (readonly [number, number])[]
	readonly geggs: readonly (readonly [number, number])[]
}

export interface ShakeBaseWave {
	readonly wave: WaveType
	startTimestamp: number
	endTimestamp?: number
	readonly players: ShakePlayerWave[]
}

export interface ShakeDefaultWave extends ShakeBaseWave {
	readonly wave: DefaultWaveType
	amount: number
	quota: number
	readonly updates: Readonly<ShakeUpdate>[]
}

export interface ShakeExtraWave extends ShakeBaseWave {
	readonly wave: 'extra'
	readonly king: ShakeKing
}

export type ShakeWave = ShakeDefaultWave | ShakeExtraWave

export type ShakeWaveRecord = Partial<Record<DefaultWaveStringType, ShakeDefaultWave> & Record<'extra', ShakeExtraWave>>

export interface ShakeTelemetry {
	readonly id: string
	readonly timestamp: number
	color?: ShakeColor
	stage?: ShakeStage
	power?: number
	readonly waveKeys: WaveType[]
	readonly waves: ShakeWaveRecord
	closed?: ShakeCloseReason
}
