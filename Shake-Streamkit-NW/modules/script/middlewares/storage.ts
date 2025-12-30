import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { type ScriptStorageV1 } from '../models/storage'
import { setScriptEnabled, setScriptWaveText } from '../slicers'
import { loadScriptStorage, saveScriptStorage } from '../utils/storage'

export const scriptStorageListener = createListenerMiddleware()

scriptStorageListener.startListening({
	matcher: isAnyOf(setScriptEnabled, setScriptWaveText),
	effect: (_action, api) => {
		const state = api.getState() as { script?: ScriptStorageV1 }
		const snapshot = state.script ?? loadScriptStorage()
		saveScriptStorage(snapshot)
	},
})
