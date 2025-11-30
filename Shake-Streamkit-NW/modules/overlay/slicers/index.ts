import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { WaveType } from '@/core/utils/wave'
import type { OomonSpawnAlertEvent } from '@/modules/overlay/models/oomon'
import type { OomonSpawnSchedule } from '@/telemetry/utils/oomonIntervals'

// State
interface OverlayState {
	poweredby: boolean
	match?: string
	server?: string
	wave?: WaveType
	oomonScheduleEnabled: boolean
	oomonSchedule?: OomonSpawnSchedule
	oomonNextSpawnIndex: number
	oomonAlerts: OomonSpawnAlertEvent[]
}

const initialState: OverlayState = {
	poweredby: false,
	oomonScheduleEnabled: true,
	oomonNextSpawnIndex: 0,
	oomonAlerts: [],
}

// Create thunk
let poweredbyTimerId: number | undefined = undefined
const POWEREDBY_DURATION = 3 * 1000
export const showPoweredby = createAsyncThunk(
	'overlay/showPoweredby',
	async () => {
		if (poweredbyTimerId) {
			window.clearTimeout(poweredbyTimerId)
		}
		await new Promise(resolve => {
			poweredbyTimerId = window.setTimeout(resolve, POWEREDBY_DURATION)
		})
	},
)

let timerId: number | undefined = undefined
const clearTimer = () => {
	if (timerId) {
		window.clearTimeout(timerId)
	}
}
export const hideEggGraphDelayed = createAsyncThunk(
	'overlay/hideEggGraphDelayed',
	async (delayInSeconds: number) => {
		clearTimer()
		await new Promise(resolve => {
			timerId = window.setTimeout(resolve, 1000 * delayInSeconds)
		})
	},
)

// Slice
const overlaySlice = createSlice({
	name: 'overlay',
	initialState,
	reducers: {
		setMatch(state, action: PayloadAction<string | undefined>) {
			if (state.wave !== undefined) {
				clearTimer()
				delete state.wave
			}
			state.oomonSchedule = undefined
			state.oomonNextSpawnIndex = 0
			state.oomonAlerts = []
			state.match = action.payload
		},
		setServer(state, action: PayloadAction<string | undefined>) {
			state.server = action.payload
		},
		showEggGraph(state, action: PayloadAction<WaveType | undefined>) {
			if (state.wave !== action.payload) {
				clearTimer()
				if (action.payload !== undefined) {
					state.wave = action.payload
				} else {
					delete state.wave
				}
			}
		},
		setOomonSchedule(state, action: PayloadAction<OomonSpawnSchedule | undefined>) {
			state.oomonSchedule = action.payload
			state.oomonNextSpawnIndex = 0
		},
		setOomonScheduleEnabled(state, action: PayloadAction<boolean>) {
			state.oomonScheduleEnabled = action.payload
		},
		setOomonNextSpawnIndex(state, action: PayloadAction<number>) {
			state.oomonNextSpawnIndex = action.payload
		},
		addOomonAlert(state, action: PayloadAction<OomonSpawnAlertEvent>) {
			state.oomonAlerts.push(action.payload)
		},
	},
	extraReducers: builder => {
		builder
			.addCase(showPoweredby.pending, state => {
				state.poweredby = true
			})
			.addCase(showPoweredby.fulfilled, state => {
				state.poweredby = false
			})
			.addCase(hideEggGraphDelayed.fulfilled, state => {
				delete state.wave
			})
	},
})

export const {
	setMatch,
	showEggGraph,
	setServer,
	setOomonSchedule,
	setOomonScheduleEnabled,
	setOomonNextSpawnIndex,
	addOomonAlert,
} = overlaySlice.actions
export default overlaySlice.reducer
