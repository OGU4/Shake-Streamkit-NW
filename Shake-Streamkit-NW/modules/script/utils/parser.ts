import { type ScriptWaveId } from '../models/storage'

export type ScriptEntry = {
	targetCount: number
	text: string
	lineIndex: number
	waveId: ScriptWaveId
}

const isCountInRange = (count: number): boolean => count >= 0 && count <= 110

export const parseScript = (waveId: ScriptWaveId, text: string): ScriptEntry[] => {
	return text.split(/\r?\n/).flatMap((line, index) => {
		const normalizedLine = line.normalize('NFKC')
		const match = normalizedLine.match(/^\s*([+-]?\d+(?:\.\d+)?)[\s\t]+(.*)$/)
		if (!match) {
			return []
		}

		const rawCount = Number.parseFloat(match[1])
		if (!Number.isFinite(rawCount)) {
			return []
		}
		const targetCount = Math.trunc(rawCount)
		if (!isCountInRange(targetCount)) {
			return []
		}

		const rawText = match[2].replace(/\s+$/u, '')
		if (rawText.trim().length === 0) {
			return []
		}

		return [{
			targetCount,
			text: rawText,
			lineIndex: index,
			waveId,
		}]
	})
}
