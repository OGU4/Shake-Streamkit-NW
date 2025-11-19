export type BroadcastSoftware =
	| 'obs'
	| 'xsplit'
	| 'twitch'

export interface BroadcastSoftwareInfo {
	readonly name: BroadcastSoftware
	readonly friendlyName: string
	readonly version: string
}

const pattern = /(OBS|XSplitChromeSource|TwitchStudio)\/([\d.]+)/
const dict: Readonly<Record<string, readonly [BroadcastSoftware, string]>> = Object.freeze({
	OBS: Object.freeze(['obs', 'OBS Studio']),
	XSplitChromeSource: Object.freeze(['xsplit', 'XSplit']),
	TwitchStudio: Object.freeze(['twitch', 'Twitch Studio']),
} satisfies Readonly<Record<string, readonly [BroadcastSoftware, string]>>)

export function detectBroadcast(): BroadcastSoftwareInfo | undefined {
	const match = pattern.exec(navigator.userAgent)
	if (match !== null) {
		const [name, friendlyName] = dict[match[1]]
		return Object.freeze({
			name,
			friendlyName,
			version: match[2],
		})
	}

	return undefined
}
