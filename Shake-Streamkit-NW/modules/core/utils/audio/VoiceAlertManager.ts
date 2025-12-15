// Voice alert playback helper for Redux middleware and services (e.g., telemetry alerts middleware).
// Currently supports only the "wave_20sec" and "joe_alert_countdown" alerts mapped to pre-generated Zunda voices.
// No React dependency; safe no-op in non-browser environments.
import wave20sec from '@/voices/zunda/wave_20sec.wav'
import joeAlertCountdown from '@/voices/zunda/joe_alert_countdown.wav'
import joeNxt1st from '@/voices/zunda/joe_nxt1st.wav'
import joeNxt2nd from '@/voices/zunda/joe_nxt2nd.wav'
import joeNxt3rd from '@/voices/zunda/joe_nxt3rd.wav'
import joeNxt4th from '@/voices/zunda/joe_nxt4th.wav'
import oomonSpawn from '@/voices/countdown_3210.wav'
import matchmakingStart from '@/voices/zunda/Call_GMK.wav'

export type AlertId =
	| 'wave_20sec'
	| 'joe_alert_countdown'
	| 'joe_nxt1st'
	| 'joe_nxt2nd'
	| 'joe_nxt3rd'
	| 'joe_nxt4th'
	| 'oomon_spawn'
	| 'matchmaking_start'

const alertSources: Record<AlertId, string> = {
	wave_20sec: wave20sec,
	joe_alert_countdown: joeAlertCountdown,
	joe_nxt1st: joeNxt1st,
	joe_nxt2nd: joeNxt2nd,
	joe_nxt3rd: joeNxt3rd,
	joe_nxt4th: joeNxt4th,
	oomon_spawn: oomonSpawn,
	matchmaking_start: matchmakingStart,
}

const activePlayers = new Map<AlertId, HTMLAudioElement>()
let masterVolume = 1.0

const clampVolume = (value: number) => Math.max(0, Math.min(1, value))

const createPlayer = (alertId: AlertId): HTMLAudioElement | null => {
	if (typeof Audio === 'undefined') {
		return null
	}

	const src = alertSources[alertId]
	if (!src) {
		console.warn(`VoiceAlertManager: Source not found for alertId=${alertId}`)
		return null
	}

	const player = new Audio(src)
	player.volume = masterVolume
	return player
}

const VoiceAlertManager = {
	init(): void {
		// Placeholder for future preloading or environment setup.
	},

	play(alertId: string): void {
		if (typeof Audio === 'undefined') {
			return
		}

		if (!(alertId in alertSources)) {
			console.warn(`VoiceAlertManager: Unknown alertId=${alertId}`)
			return
		}

		const id = alertId as AlertId

		let player = activePlayers.get(id)
		if (!player) {
			player = createPlayer(id)
			if (!player) {
				return
			}
			activePlayers.set(id, player)
		}

		if (!player.paused && !player.ended) {
			// Ignore duplicate play requests while the alert is already playing.
			return
		}

		try {
			player.currentTime = 0
			player.volume = masterVolume
			const playPromise = player.play()
			if (playPromise && typeof playPromise.catch === 'function') {
				playPromise.catch(err => {
					console.warn('VoiceAlertManager: Failed to play alert', err)
				})
			}
		} catch (err) {
			console.warn('VoiceAlertManager: Failed to play alert', err)
		}
	},

	setVolume(volume: number): void {
		masterVolume = clampVolume(volume)
		activePlayers.forEach(player => {
			player.volume = masterVolume
		})
	},

	getVolume(): number {
		return masterVolume
	},
}

export default VoiceAlertManager
