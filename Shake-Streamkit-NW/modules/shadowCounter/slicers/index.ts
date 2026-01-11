import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ShadowCounterState = {
	running: boolean
	value: number
	prevValue: number | null
	wave?: number
}

const initialState: ShadowCounterState = {
	running: false,
	value: 0,
	prevValue: null,
}

const shadowCounterSlice = createSlice({
	name: 'shadowCounter',
	initialState,
	reducers: {
		start(state, action: PayloadAction<{ wave: number }>) {
			state.running = true
			state.value = 109
			state.prevValue = null
			state.wave = action.payload.wave
		},
		stop(state) {
			state.running = false
			state.value = 0
			state.prevValue = null
			delete state.wave
		},
		tick(state) {
			if (!state.running) {
				return
			}
			state.prevValue = state.value
			state.value = Math.max(0, state.value - 1)
			if (state.value === 0) {
				state.running = false
			}
		},
	},
})

export const { start, stop, tick } = shadowCounterSlice.actions
export default shadowCounterSlice.reducer
