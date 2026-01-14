import { defaultScriptStorage, type ScriptSet, type ScriptStorage, type ScriptStorageV3, type ScriptWaveId } from '../models/storage'

export const SCRIPT_STORAGE_KEY = 'shake-streamkit-nw:script'

const SCRIPT_WAVE_IDS: ScriptWaveId[] = ['Wave1', 'Wave2', 'Wave3', 'Wave4', 'Wave5']
const SCRIPT_SET_COUNT = 5

const createEmptyWaves = (): Record<ScriptWaveId, string> => {
	return SCRIPT_WAVE_IDS.reduce((draft, waveId) => {
		draft[waveId] = ''
		return draft
	}, {} as Record<ScriptWaveId, string>)
}

const normalizeWaves = (data: any): Record<ScriptWaveId, string> => {
	return SCRIPT_WAVE_IDS.reduce((draft, waveId) => {
		const text = typeof data?.[waveId] === 'string' ? data[waveId] : ''
		draft[waveId] = text
		return draft
	}, {} as Record<ScriptWaveId, string>)
}

const normalizeScriptSet = (data: any): ScriptSet => {
	return {
		waves: normalizeWaves(data?.waves),
	}
}

const normalizeScriptStorageV3 = (data: any): ScriptStorageV3 => {
	const index = typeof data?.activeSetIndex === 'number'
		? Math.trunc(data.activeSetIndex)
		: 0
	const activeSetIndex = index >= 0 && index < SCRIPT_SET_COUNT ? index : 0

	const rawSets = Array.isArray(data?.sets) ? data.sets : []
	const sets = Array.from({ length: SCRIPT_SET_COUNT }, (_value, idx) => {
		const rawSet = rawSets[idx]
		return rawSet ? normalizeScriptSet(rawSet) : { waves: createEmptyWaves() }
	})

	return {
		version: 3,
		enabled: data?.enabled === true,
		volume: typeof data?.volume === 'number' ? Math.max(0, Math.min(1, data.volume)) : 1,
		voice: typeof data?.voice === 'string' ? data.voice : undefined,
		activeSetIndex,
		sets,
	}
}

const migrate = (data: any): ScriptStorageV3 => {
	if (data?.version === 3) {
		return normalizeScriptStorageV3(data)
	}
	return defaultScriptStorage
}

export const loadScriptStorage = (): ScriptStorageV3 => {
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

export const saveScriptStorage = (storage: ScriptStorageV3): void => {
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
