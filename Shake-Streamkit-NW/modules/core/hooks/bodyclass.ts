import { useLayoutEffect } from 'react'

import { useAppSelector } from 'app/hooks'

import { useEnvironment } from '../components/EnvironmentProvider'

export const useBodyClass = () => {
	const environment = useEnvironment()
	const broadcastEnabled = (environment && 'broadcast' in environment) ?? false

	let reducedEnabled = useAppSelector(state => state.config.reduced)
	if (reducedEnabled === undefined) {
		reducedEnabled = environment?.reduced
		if (reducedEnabled === undefined) {
			reducedEnabled = false
		}
	}

	useLayoutEffect(() => {
		if (broadcastEnabled) {
			document.body.classList.add('env-broadcast', 'env-nonblur')
		}
		if (reducedEnabled) {
			document.body.classList.add('ax-reduced')
		}
		return () => {
			if (broadcastEnabled) {
				document.body.classList.remove('env-broadcast', 'env-nonblur')
			}
			if (reducedEnabled) {
				document.body.classList.remove('ax-reduced')
			}
		}
	}, [reducedEnabled])
}
