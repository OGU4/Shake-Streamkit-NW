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

export type ScriptStorage = ScriptStorageV1

export const defaultScriptStorage: ScriptStorageV1 = {
	version: 1,
	enabled: false,
	waves: {
		Wave1: '',
		Wave2: '',
		Wave3: '',
		Wave4: '',
		Wave5: '',
	},
}
