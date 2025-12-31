import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'

import autoCleanupLogs from '@/notification/middlewares/autoCleanupLogs'
import log from '@/notification/slicers'
import script from '@/script/slicers'
import { scriptStorageListener } from '@/script/middlewares/storage'
import scriptSpeechMiddleware from '@/script/middlewares/speech'
import overlay from '@/overlay/slicers'
import config from '@/settings/slicers'
import telemetry from '@/telemetry/slicers'

import overlayMiddleware from '../modules/overlay/middlewares'
import telemetryAlertsMiddleware from '../modules/telemetry/middlewares/alerts'

const rootReducer = combineReducers({
	config,
	log,
	script,
	overlay,
	telemetry,
})

// Infer the `RootState` types from the store itself
export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		})
		.concat(
			scriptStorageListener.middleware as any,
			scriptSpeechMiddleware as any,
			overlayMiddleware as any,
			telemetryAlertsMiddleware as any,
			autoCleanupLogs,
		),
})

export const persistor = persistStore(store)

// Get the type of our store variable
export type AppStore = typeof store

// Infer the `AppDispatch` types from the store itself
export type AppDispatch = AppStore['dispatch']

export default store
