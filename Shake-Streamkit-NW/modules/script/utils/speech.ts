const speechAvailable = () => typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined'

const clampVolume = (volume: number | undefined): number => {
	if (typeof volume !== 'number') {
		return 1
	}
	return Math.max(0, Math.min(1, volume))
}

const getJapaneseVoices = (): SpeechSynthesisVoice[] => {
	if (!speechAvailable()) {
		return []
	}
	return window.speechSynthesis.getVoices().filter(voice => {
		const lang = voice.lang?.toLowerCase() ?? ''
		return lang.startsWith('ja')
	})
}

const resolveVoice = (voiceId: string | undefined): SpeechSynthesisVoice | undefined => {
	const voices = getJapaneseVoices()
	if (voices.length === 0) {
		return undefined
	}
	if (voiceId) {
		const found = voices.find(v => v.voiceURI === voiceId)
		if (found) {
			return found
		}
	}
	return voices[0]
}

export const cancelSpeech = () => {
	if (!speechAvailable()) {
		return
	}
	window.speechSynthesis.cancel()
}

export const speakText = (text: string, volume: number | undefined, voiceId: string | undefined): void => {
	if (!speechAvailable()) {
		return
	}
	const utterance = new SpeechSynthesisUtterance(text)
	utterance.volume = clampVolume(volume)
	const voice = resolveVoice(voiceId)
	if (voice) {
		utterance.voice = voice
	}
	window.speechSynthesis.cancel()
	window.speechSynthesis.speak(utterance)
}

export { getJapaneseVoices }
