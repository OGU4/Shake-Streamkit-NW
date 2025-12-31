import { defaultScriptStorage, type ScriptStorage, type ScriptStorageV2, type ScriptWaveId } from '../models/storage'

export const SCRIPT_STORAGE_KEY = 'shake-streamkit-nw:script'

const SCRIPT_WAVE_IDS: ScriptWaveId[] = ['Wave1', 'Wave2', 'Wave3', 'Wave4', 'Wave5']

const normalizeScriptStorageV2 = (data: any): ScriptStorageV2 => {
	const waves = SCRIPT_WAVE_IDS.reduce((draft, waveId) => {
		const text = typeof data?.waves?.[waveId] === 'string'
			? data.waves[waveId]
			: ''
		draft[waveId] = text
		return draft
	}, {} as Record<ScriptWaveId, string>)

	return {
		version: 2,
		enabled: data?.enabled === true,
		volume: typeof data?.volume === 'number' ? Math.max(0, Math.min(1, data.volume)) : 1,
		voice: typeof data?.voice === 'string' ? data.voice : undefined,
		waves,
	}
}

const migrate = (data: any): ScriptStorageV2 => {
	if (data?.version === 2) {
		return normalizeScriptStorageV2(data)
	}
	if (data?.version === 1) {
		const next = normalizeScriptStorageV2({
			...data,
			volume: 1,
			voice: undefined,
		})
		return next
	}
	return defaultScriptStorage
}

export const loadScriptStorage = (): ScriptStorageV2 => {
	if (typeof window === 'undefined') {
		return defaultScriptStorage
	}

	try {
		const stored = window.localStorage.getItem(SCRIPT_STORAGE_KEY)
		if (!stored) {
			return defaultScriptStorage
		}

		const parsed = JSON.parse(stored)
		return migrate(parsed as ScriptStorage)
	} catch {
		return defaultScriptStorage
	}
}

export const saveScriptStorage = (storage: ScriptStorageV2): void => {
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
