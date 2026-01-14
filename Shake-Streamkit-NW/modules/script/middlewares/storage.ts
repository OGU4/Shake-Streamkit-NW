import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { type ScriptStorageV3 } from '../models/storage'
import { setActiveSetIndex, setScriptEnabled, setScriptVoice, setScriptVolume, setScriptWaveText } from '../slicers'
import { loadScriptStorage, saveScriptStorage } from '../utils/storage'

export const scriptStorageListener = createListenerMiddleware()

scriptStorageListener.startListening({
	matcher: isAnyOf(setActiveSetIndex, setScriptEnabled, setScriptWaveText, setScriptVolume, setScriptVoice),
	effect: (_action, api) => {
		const state = api.getState() as { script?: ScriptStorageV3 }
		const snapshot = state.script ?? loadScriptStorage()
		saveScriptStorage(snapshot)
	},
})
