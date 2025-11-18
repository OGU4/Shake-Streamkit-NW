import { type PropsWithChildren, createContext, useContext } from 'react'

import { detectLanguage } from '@/core/utils/language'

import { type BroadcastSoftwareInfo, detectBroadcast } from '@/core/utils/broadcast'

interface EnvrionmentInfo {
	broadcast?: BroadcastSoftwareInfo
	lang: string
	reduced: boolean
	secure: boolean
}

const EnvironmentContext = createContext<EnvrionmentInfo | undefined>(undefined)

const EnvironmentProvider = ({ children }: PropsWithChildren) => {
	const broadcast = detectBroadcast()
	const lang = detectLanguage()
	const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches
	const secure = window.location.protocol === 'https:'
	const environment: EnvrionmentInfo = broadcast
		? { broadcast, lang, reduced, secure }
		: { lang, reduced, secure }

	return (
		<EnvironmentContext.Provider value={environment}>
			{children}
		</EnvironmentContext.Provider>
	)
}

export const useEnvironment = () => {
	const info = useContext(EnvironmentContext)
	return info
}

export default EnvironmentProvider
