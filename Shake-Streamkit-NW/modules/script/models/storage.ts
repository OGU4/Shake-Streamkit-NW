export type ScriptWaveId =
	| 'Wave1'
	| 'Wave2'
	| 'Wave3'
	| 'Wave4'
	| 'Wave5'

export interface ScriptStorageV1 {
	version: 1
	enabled: boolean
	waves: Record<ScriptWaveId, string>
}

export interface ScriptStorageV2 extends ScriptStorageV1 {
	version: 2
	volume: number
	voice?: string
}

export interface ScriptSet {
	waves: Record<ScriptWaveId, string>
}

export interface ScriptStorageV3 {
	version: 3
	enabled: boolean
	volume: number
	voice?: string
	activeSetIndex: number
	sets: ScriptSet[]
}

export type ScriptStorage = ScriptStorageV1 | ScriptStorageV2 | ScriptStorageV3

export const defaultScriptStorage: ScriptStorageV3 = {
	version: 3,
	enabled: false,
	volume: 1,
	activeSetIndex: 0,
	sets: [
		{
			waves: {
				Wave1: '',
				Wave2: '',
				Wave3: '',
				Wave4: '',
				Wave5: '',
			},
		},
		{
			waves: {
				Wave1: '',
				Wave2: '',
				Wave3: '',
				Wave4: '',
				Wave5: '',
			},
		},
		{
			waves: {
				Wave1: '',
				Wave2: '',
				Wave3: '',
				Wave4: '',
				Wave5: '',
			},
		},
		{
			waves: {
				Wave1: '',
				Wave2: '',
				Wave3: '',
				Wave4: '',
				Wave5: '',
			},
		},
		{
			waves: {
				Wave1: '',
				Wave2: '',
				Wave3: '',
				Wave4: '',
				Wave5: '',
			},
		},
	],
}
