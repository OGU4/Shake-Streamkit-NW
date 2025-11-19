import { ShakeStage } from './constant'

export type ShakeMatchType =
	| 'unknown'
	| 'realtime'
	| 'failed_wave1'
	| 'failed_wave2'
	| 'failed_wave3'
	| 'failed_wave4'
	| 'failed_wave5'
	| 'failed_error'
	| 'cleared'

export interface ShakeMatch {
	readonly type: ShakeMatchType
	readonly id: string
	readonly timestampInMillisecond: number
	readonly stage?: ShakeStage
}
