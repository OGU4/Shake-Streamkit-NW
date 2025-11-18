import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { DefaultWaveType } from '@/core/utils/wave'

// Constant
const MAX_LOG_ENTRIES = 63
const LOG_EXPIRATION_HOURS = 3

// State
export type LogType =
	| 'test'
	| 'websocket_connect'
	| 'websocket_disconnect'
	| 'wave_alert'

export interface Log {
	readonly type: LogType
	readonly timestamp: number
}

export interface WaveAlertLog extends Log {
	readonly type: 'wave_alert'
	readonly matchId: string
	readonly wave: DefaultWaveType
	readonly threshold: number
	readonly message: string
}

export interface LogState {
	logs: Log[]
}

const initialState: LogState = {
	logs: [],
}

// Slice
const logSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		addLog(state, action: PayloadAction<Log>) {
			state.logs.unshift(action.payload)
		},
		cleanupLogs(state) {
			const current = Date.now()
			const expirationTime = LOG_EXPIRATION_HOURS * 60 * 60 * 1000

			const newLogs: Log[] = []
			for (let i = 0; i < state.logs.length; ++i) {
				const log = state.logs[i]
				if ((current - log.timestamp) <= expirationTime) {
					newLogs.push(log)
					if (newLogs.length >= MAX_LOG_ENTRIES) {
						break
					}
				}
			}
			state.logs = newLogs
		},
	},
})

export const {
	addLog,
	cleanupLogs,
} = logSlice.actions
export default logSlice.reducer
