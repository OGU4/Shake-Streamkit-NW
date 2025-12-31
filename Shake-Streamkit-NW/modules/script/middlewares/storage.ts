import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { type ScriptStorageV2 } from '../models/storage'
import { setScriptEnabled, setScriptVoice, setScriptVolume, setScriptWaveText } from '../slicers'
import { loadScriptStorage, saveScriptStorage } from '../utils/storage'

export const scriptStorageListener = createListenerMiddleware()

scriptStorageListener.startListening({
	matcher: isAnyOf(setScriptEnabled, setScriptWaveText, setScriptVolume, setScriptVoice),
	effect: (_action, api) => {
		const state = api.getState() as { script?: ScriptStorageV2 }
		const snapshot = state.script ?? loadScriptStorage()
		saveScriptStorage(snapshot)
	},
})
