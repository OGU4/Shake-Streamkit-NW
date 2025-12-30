import { defaultScriptStorage, type ScriptStorageV1, type ScriptWaveId } from '../models/storage'

export const SCRIPT_STORAGE_KEY = 'shake-streamkit-nw:script'

const SCRIPT_WAVE_IDS: ScriptWaveId[] = ['Wave1', 'Wave2', 'Wave3', 'Wave4', 'Wave5']

const normalizeScriptStorageV1 = (data: any): ScriptStorageV1 => {
	const waves = SCRIPT_WAVE_IDS.reduce((draft, waveId) => {
		const text = typeof data?.waves?.[waveId] === 'string'
			? data.waves[waveId]
			: ''
		draft[waveId] = text
		return draft
	}, {} as Record<ScriptWaveId, string>)

	return {
		version: 1,
		enabled: data?.enabled === true,
		waves,
	}
}

export const loadScriptStorage = (): ScriptStorageV1 => {
	if (typeof window === 'undefined') {
		return defaultScriptStorage
	}

	try {
		const stored = window.localStorage.getItem(SCRIPT_STORAGE_KEY)
		if (!stored) {
			return defaultScriptStorage
		}

		const parsed = JSON.parse(stored)
		if (parsed?.version !== 1) {
			return defaultScriptStorage
		}

		return normalizeScriptStorageV1(parsed)
	} catch {
		return defaultScriptStorage
	}
}

export const saveScriptStorage = (storage: ScriptStorageV1): void => {
	if (typeof window === 'undefined') {
		return
	}

	try {
		window.localStorage.setItem(SCRIPT_STORAGE_KEY, JSON.stringify(storage))
	} catch {
		// Best-effort persistence: ignore storage errors (storage full, disabled, etc.)
	}
}

export { SCRIPT_WAVE_IDS }
