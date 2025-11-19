import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from 'app/store'

import { ShakeMatch } from './models/match'

import type { ShakeTelemetry } from './models/data'

function selectId(_: unknown, id: string): string {
	return id
}

function selectNullableId(_: unknown, id: string | undefined): string | undefined {
	return id
}

export function selectMatches(state: RootState): ShakeMatch[] {
	return state.telemetry.matches
}

export function selectTelemetries(state: RootState) {
	return state.telemetry.entities
}

function selectTelemetryById(entities: Record<string, Readonly<ShakeTelemetry>>, id: string): Readonly<ShakeTelemetry> {
	return entities[id]
}

export function selectTelemetryByNullableId(entities: Record<string, Readonly<ShakeTelemetry>>, id: string | undefined): Readonly<ShakeTelemetry> | undefined {
	return id !== undefined ? entities[id] : undefined
}

export const getTelemetryById = createSelector(
	selectTelemetries,
	selectId,
	selectTelemetryById,
)

export const getTelemetryByNullableId = createSelector(
	selectTelemetries,
	selectNullableId,
	selectTelemetryByNullableId,
)
