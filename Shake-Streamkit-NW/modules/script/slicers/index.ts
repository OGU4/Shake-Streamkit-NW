import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { defaultScriptStorage, type ScriptStorageV3, type ScriptWaveId } from '../models/storage'
import { loadScriptStorage } from '../utils/storage'

export const SCRIPT_WAVE_IDS: ScriptWaveId[] = ['Wave1', 'Wave2', 'Wave3', 'Wave4', 'Wave5']
const SCRIPT_SET_COUNT = 5

type ScriptState = ScriptStorageV3

const initialState: ScriptState = loadScriptStorage()

const scriptSlice = createSlice({
	name: 'script',
	initialState,
	reducers: {
	hydrateScript(_state, action: PayloadAction<ScriptStorageV3>) {
		return action.payload
	},
		setActiveSetIndex(state, action: PayloadAction<number>) {
			const value = Math.trunc(action.payload)
			if (Number.isNaN(value)) {
				state.activeSetIndex = 0
				return
			}
			state.activeSetIndex = Math.max(0, Math.min(SCRIPT_SET_COUNT - 1, value))
		},
		setScriptEnabled(state, action: PayloadAction<boolean>) {
			state.enabled = action.payload
		},
		setScriptWaveText(state, action: PayloadAction<{ waveId: ScriptWaveId; text: string }>) {
			const activeSet = state.sets[state.activeSetIndex]
			if (!activeSet) {
				return
			}
			activeSet.waves[action.payload.waveId] = action.payload.text
		},
		setScriptVolume(state, action: PayloadAction<number>) {
			state.volume = Math.max(0, Math.min(1, action.payload))
		},
		setScriptVoice(state, action: PayloadAction<string | undefined>) {
			state.voice = action.payload
		},
		resetScript() {
			return defaultScriptStorage
		},
	},
})

export const {
	hydrateScript,
	resetScript,
	setActiveSetIndex,
	setScriptEnabled,
	setScriptWaveText,
	setScriptVolume,
	setScriptVoice,
} = scriptSlice.actions
export default scriptSlice.reducer
