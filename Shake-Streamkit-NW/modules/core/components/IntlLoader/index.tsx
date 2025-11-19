import { type PropsWithChildren, useState, useLayoutEffect } from 'react'
import { IntlProvider } from 'react-intl'

import { useAppSelector } from 'app/hooks'

import { loadLocale } from '@/core/utils/language'
import { useEnvironment } from '../EnvironmentProvider'

const IntlLoader = ({ children }: PropsWithChildren) => {
	const [messages, setMessages] = useState<any>(null)

	const userLanguage = useEnvironment()?.lang ?? 'en'
	const language = useAppSelector(state => state.config.language) ?? userLanguage
	useLayoutEffect(() => {
		const controller = new AbortController()
		const fetchMessages = async () => {
			try {
				const messages = await loadLocale(language, controller.signal)
				document.documentElement.setAttribute('lang', language)
				setMessages(messages)
			} catch (err) {
				if (err instanceof DOMException) {
					if (err.name !== 'AbortError') {
						console.log(err)
					}
				} else {
					console.log(err)
				}
			}
		}
		if (language === 'en') {
			document.documentElement.setAttribute('lang', 'en')
			setMessages(null)
		} else {
			fetchMessages()
		}

		return () => {
			controller.abort()
		}
	}, [language])

	if (language !== 'en' && messages === null) {
		return (
			<div className='Message'>
				Loading…
			</div>
		)
	}

	return (
		<IntlProvider
			defaultLocale='en'
			locale={language}
			messages={messages}
		>
			{children}
		</IntlProvider>
	)
}

export default IntlLoader
