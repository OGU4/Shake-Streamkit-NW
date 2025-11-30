/**
 * Represents a quota range and the corresponding special spawn interval (seconds).
 * Kept generic so other waves can reuse the shape when tables are added later.
 */
export interface OomonQuotaIntervalRule {
	readonly minQuota: number
	readonly maxQuota: number
	readonly intervalSeconds: number
}

/**
 * Salmon Run NEXT WAVE: Wave1 quota (golden egg requirement) to special spawn interval mapping.
 * The quota for Wave1 is expected to be in the 3–30 range; out-of-range handling is left as a TODO.
 */
export const WAVE1_OOMON_QUOTA_INTERVAL_TABLE: readonly OomonQuotaIntervalRule[] = [
	{ minQuota: 3, maxQuota: 7, intervalSeconds: 36.0 },
	{ minQuota: 8, maxQuota: 10, intervalSeconds: 24.0 },
	{ minQuota: 11, maxQuota: 15, intervalSeconds: 18.0 },
	{ minQuota: 16, maxQuota: 20, intervalSeconds: 14.4 },
	{ minQuota: 21, maxQuota: 25, intervalSeconds: 12.0 },
	{ minQuota: 26, maxQuota: 27, intervalSeconds: 10.3 },
	{ minQuota: 28, maxQuota: 29, intervalSeconds: 9.0 },
	{ minQuota: 30, maxQuota: 30, intervalSeconds: 8.0 },
] as const

/**
 * Lookup special spawn interval (seconds) from wave number and quota.
 * Currently supports Wave1 only; other waves or out-of-range quotas return undefined.
 * TODO: Decide how to surface errors (e.g., logging) for unsupported waves or quota ranges.
 */
export function getOomonSpawnIntervalSeconds(waveNumber: number, quota: number): number | undefined {
	if (waveNumber !== 1) {
		return undefined // TODO: Add tables for Wave2/3 and handle unsupported waves explicitly
	}

	const rule = WAVE1_OOMON_QUOTA_INTERVAL_TABLE.find(({ minQuota, maxQuota }) => quota >= minQuota && quota <= maxQuota)
	if (rule === undefined) {
		return undefined // TODO: Handle Wave1 quota outside expected range (3–30)
	}
	return rule.intervalSeconds
}

/**
 * Represents the theoretical schedule of special spawns for a single wave (remaining time based).
 * Currently holds only the interval and the remaining-seconds schedule; waveNumber/quota can be added later if needed.
 */
export interface OomonSpawnSchedule {
	readonly intervalSeconds: number
	readonly spawnTimesRemaining: readonly number[]
}

/**
 * Compute theoretical special spawn times (remaining seconds) from a fixed interval.
 * Assumes a standard 100s wave, floors fractional seconds, guarantees a final spawn at 28s,
 * and ignores real-world drift/latency (purely deterministic schedule).
 * intervalSeconds is expected to be a positive value already derived from quota.
 */
export function computeOomonSpawnScheduleFromInterval(intervalSeconds: number): OomonSpawnSchedule {
	const START_REMAINING = 100
	const LAST_SPAWN_REMAINING = 28

	// TODO: Decide how to handle invalid or zero/negative intervalSeconds.
	const spawnTimes: number[] = [START_REMAINING]

	let currentTime = START_REMAINING
	while (true) {
		currentTime -= intervalSeconds
		if (currentTime <= LAST_SPAWN_REMAINING) {
			break
		}
		spawnTimes.push(Math.floor(currentTime))
	}

	if (!spawnTimes.includes(LAST_SPAWN_REMAINING)) {
		spawnTimes.push(LAST_SPAWN_REMAINING)
	}

	return {
		intervalSeconds,
		spawnTimesRemaining: spawnTimes,
	}
}

/**
 * Resolve the theoretical special spawn schedule for a wave from its quota.
 * Uses the wave-specific quota→interval lookup (currently Wave1 only) and then builds the remaining-time schedule.
 * Returns undefined when quota/waveNumber are unsupported; logging/UI handling is expected at a higher layer (TODO).
 * TODO: Extend to Wave2/3 or contest modes when interval tables are available.
 */
export function getOomonSpawnScheduleForWave(waveNumber: number, quota: number): OomonSpawnSchedule | undefined {
	const intervalSeconds = getOomonSpawnIntervalSeconds(waveNumber, quota)
	if (intervalSeconds === undefined) {
		return undefined // Unsupported wave/quota; handled by caller (e.g., logging/UI) later.
	}
	return computeOomonSpawnScheduleFromInterval(intervalSeconds)
}
