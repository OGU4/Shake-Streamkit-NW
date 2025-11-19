import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { WritableDraft, produce } from 'immer'

import { getMatchFromTelemetry } from '../utils/getMatchFromTelemetry'
import { TelemetryProcessor } from '../utils/processor'

import type { ShakeBaseWave, ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry, ShakeUpdate, ShakeWaveRecord } from '../models/data'
import type { ShakeMatch } from '../models/match'
import type { ShakeEvent } from '../models/telemetry'

// State
export type TelemetryState = {
	readonly matches: ShakeMatch[]
	readonly entities: Record<string, Readonly<ShakeTelemetry>>
}

const initialState: TelemetryState = {
	matches: [],
	entities: {},
}

// Filters
const processor = new TelemetryProcessor(4)

const produceUpdates = (
	draft: WritableDraft<Readonly<ShakeUpdate>>[],
	payload: Readonly<ShakeUpdate>[],
) => {
	// let i = 0
	// for (; i < draft.length; ++i) {
	// 	draft[i] = Object.assign(draft[i], payload[i])  // TODO: diff check
	// }
	let i = draft.length
	for (; i < payload.length; ++i) {
		const clonePayload = Object.assign({}, payload[i])
		draft.push(clonePayload)
	}
}

function produceStatus(
	draft: WritableDraft<[number, number][]>,
	payload: readonly (readonly [number, number])[],
) {
	let i = 0
	for (; i < draft.length; ++i) {
		if (!payload[i].equals(draft[i])) {
			draft[i] = payload[i].slice(0) as [number, number]
		}
	}
	for (; i < payload.length; ++i) {
		draft[i] = payload[i].slice(0) as [number, number]
	}
}

function produceWave(
	draft: WritableDraft<Readonly<ShakeBaseWave>>,
	payload: Readonly<ShakeBaseWave>,
) {
	const { players } = payload
	for (let i = 0; i < 4; ++i) {
		draft.players[i].index = players[i].index
		produceStatus(draft.players[i].alives, players[i].alives)
		produceStatus(draft.players[i].geggs, players[i].geggs)
	}
}

function produceDefaultWave(
	draft: WritableDraft<Readonly<ShakeDefaultWave>>,
	payload: Readonly<ShakeDefaultWave>,
) {
	const { updates, players, ...props } = payload
	produceUpdates(draft.updates, updates)
	produceWave(draft, payload)
	Object.assign(draft, props)
}

function produceWaves(draft: WritableDraft<ShakeWaveRecord>, payload: Readonly<ShakeWaveRecord>) {
	for (const [waveKey, wavePayload] of Object.entries(payload)) {
		if (Object.hasOwn(draft, waveKey)) {
			if (waveKey === 'extra') {
				produceWave(draft['extra']!, wavePayload as Readonly<ShakeExtraWave>)
			} else {
				produceDefaultWave(draft[waveKey]!, wavePayload as Readonly<ShakeDefaultWave>)
			}
		} else {
			if (waveKey === 'extra') {
				const { players, ...props } = wavePayload as Readonly<ShakeExtraWave>
				draft['extra'] = {
					...props,
					players: players.map(function (p) {
						return {
							index: p.index,
							alives: p.alives.slice(0) as [number, number][],
							geggs: p.geggs.slice(0) as [number, number][],
						}
					}),
				}
			} else {
				const { updates, players, ...props } = wavePayload as Readonly<ShakeDefaultWave>
				draft[waveKey] = {
					...props,
					updates: updates.map(u => Object.assign({}, u)),
					players: players.map(function (p) {
						return {
							index: p.index,
							alives: p.alives.slice(0) as [number, number][],
							geggs: p.geggs.slice(0) as [number, number][],
						}
					}),
				}
			}
		}
	}
}

function produceMatch(
	draft: (WritableDraft<Readonly<ShakeTelemetry>>),
	payload: (Readonly<ShakeTelemetry>),
) {
	const { waveKeys, waves, ...props } = payload
	if (!waveKeys.equals(draft.waveKeys)) {
		draft.waveKeys = waveKeys.slice(0)
	}
	produceWaves(draft.waves, waves)
	Object.assign(draft, props)
}

// Slice
const telemetrySlice = createSlice({
	name: 'telemetry',
	initialState,
	reducers: {
		addTelemetry(state, action: PayloadAction<ShakeEvent>) {
			processor.process(action.payload)

			return produce(state, draft => {
				const newTelemetry = processor.current
				const newTelemetryId = newTelemetry.id
				if (Object.hasOwn(draft.entities, newTelemetryId)) {
					const draftMatchState = draft.entities[newTelemetryId]
					produceMatch(draftMatchState, newTelemetry)
				} else {
					const { waveKeys, waves, ...props } = newTelemetry
					draft.entities[newTelemetryId] = {
						...props,
						waveKeys: waveKeys.slice(0),
						waves: Object.entries(waves).reduce((draftWaves, pair) => {
							const [waveKey, wave] = pair
							if (waveKey === 'extra') {
								draftWaves['extra'] = wave as WritableDraft<ShakeExtraWave>
							} else {
								const { updates, ...props } = wave as ShakeDefaultWave
								draftWaves[waveKey] = {
									...props,
									updates: updates.map(u => Object.assign({}, u)),
								} as WritableDraft<ShakeDefaultWave>
							}
							return draftWaves
						}, {} as WritableDraft<ShakeWaveRecord>),
					}

					const match = getMatchFromTelemetry(newTelemetry)
					draft.matches.push(match)
				}
				return draft
			})
		},
		removeTelemetry(state, action: PayloadAction<string>) {
			const matchId = action.payload
			if (Object.hasOwn(state.entities, matchId)) {
				delete state.entities[matchId]

				const index = state.matches.findIndex(match => match.id === matchId)
				state.matches.splice(index, 1)
			}
		},
		resetTelemetry(state) {
			state.matches.length = 0
			state.entities = {}
		},

		setTelemetry(state, action: PayloadAction<ShakeEvent[]>) {
			const temporary = new TelemetryProcessor(4)
			action.payload.forEach(ev => {
				temporary.process(ev)

				if (temporary.isNewContext()) {
					const telemetry = temporary.current
					state.entities[telemetry.id] = telemetry as WritableDraft<ShakeTelemetry>

					const match = getMatchFromTelemetry(telemetry)
					state.matches.push(match)
				}
			})

			// Set closed to the last match
			temporary.resetContext()
		},
	},
})

export const {
	addTelemetry,
	resetTelemetry,
	setTelemetry,
} = telemetrySlice.actions
export default telemetrySlice.reducer
