import { createSelector } from '@reduxjs/toolkit'

import { WaveType } from '@/core/utils/wave'
import type { ShakeDefaultWave, ShakeExtraWave, ShakeTelemetry } from '@/telemetry/models/data'
import { selectTelemetries, selectTelemetryByNullableId } from '@/telemetry/selector'

import type { RootState } from '@/../app/store'

export function selectMatchId(state: RootState): string | undefined {
	return state.overlay.match
}

export function selectWave(state: RootState): WaveType | undefined {
	return state.overlay.wave
}

export function selectTelemetry(_: unknown, telemetry: Readonly<ShakeTelemetry> | undefined): Readonly<ShakeTelemetry> | undefined {
	return telemetry
}

function selectWaves(telemetry: Readonly<ShakeTelemetry> | undefined): WaveType[] | undefined {
	return telemetry?.waveKeys
}

function selectWaveByNullableWave(telemetry: Readonly<ShakeTelemetry> | undefined, wave: WaveType | undefined): Readonly<ShakeDefaultWave> | Readonly<ShakeExtraWave> | undefined {
	return wave !== undefined ? telemetry?.waves[wave] : undefined
}

export const getCurrentTelemetry = createSelector(
	selectTelemetries,
	selectMatchId,
	selectTelemetryByNullableId,
)

export const getCurrentWaves = createSelector(
	getCurrentTelemetry,
	selectWaves,
)

export const getCurrentWaveFromTelemetry = createSelector(
	selectTelemetry,
	selectWave,
	selectWaveByNullableWave,
)
