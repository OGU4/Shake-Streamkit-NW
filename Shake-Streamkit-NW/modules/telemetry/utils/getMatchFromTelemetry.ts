import type { ShakeTelemetry } from '../models/data'
import type { ShakeMatch, ShakeMatchType } from '../models/match'

function getType(telemetry: ShakeTelemetry): ShakeMatchType {
	if (telemetry.closed === undefined) {
		return 'realtime'
	}

	switch (telemetry.closed) {
	case 'network':
		return 'failed_error'
	default: {
		const lastKey = telemetry.waveKeys.last
		if (lastKey !== undefined) {
			const lastWave = telemetry.waves[lastKey]!
			switch (lastWave.wave) {
			case 'extra':
				return 'cleared'
			default:
				if (lastWave.quota <= lastWave.amount) {
					return 'cleared'
				}
				return `failed_wave${lastWave.wave}`
			}
		}
	}
	}
	return 'unknown'
}

export function getMatchFromTelemetry(telemetry: ShakeTelemetry): ShakeMatch {
	return {
		type: getType(telemetry),
		id: telemetry.id,
		timestampInMillisecond: 1000 * telemetry.timestamp,
		stage: telemetry.stage,
	}
}
