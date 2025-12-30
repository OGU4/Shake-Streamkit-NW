import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { defaultScriptStorage, type ScriptStorageV1, type ScriptWaveId } from '../models/storage'
import { loadScriptStorage } from '../utils/storage'

export const SCRIPT_WAVE_IDS: ScriptWaveId[] = ['Wave1', 'Wave2', 'Wave3', 'Wave4', 'Wave5']

type ScriptState = ScriptStorageV1

const initialState: ScriptState = loadScriptStorage()

const scriptSlice = createSlice({
	name: 'script',
	initialState,
	reducers: {
		hydrateScript(_state, action: PayloadAction<ScriptStorageV1>) {
			return action.payload
		},
		setScriptEnabled(state, action: PayloadAction<boolean>) {
			state.enabled = action.payload
		},
		setScriptWaveText(state, action: PayloadAction<{ waveId: ScriptWaveId; text: string }>) {
			state.waves[action.payload.waveId] = action.payload.text
		},
		resetScript() {
			return defaultScriptStorage
		},
	},
})

export const {
	hydrateScript,
	resetScript,
	setScriptEnabled,
	setScriptWaveText,
} = scriptSlice.actions
export default scriptSlice.reducer
