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

export type ScriptStorage = ScriptStorageV1 | ScriptStorageV2

export const defaultScriptStorage: ScriptStorageV2 = {
	version: 2,
	enabled: false,
	volume: 1,
	waves: {
		Wave1: '',
		Wave2: '',
		Wave3: '',
		Wave4: '',
		Wave5: '',
	},
}
