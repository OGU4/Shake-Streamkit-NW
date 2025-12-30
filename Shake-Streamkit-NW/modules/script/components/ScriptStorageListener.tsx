import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { hydrateScript } from '../slicers'
import { SCRIPT_STORAGE_KEY, loadScriptStorage, saveScriptStorage } from '../utils/storage'

const ScriptStorageListener = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const next = loadScriptStorage()
		dispatch(hydrateScript(next))
		saveScriptStorage(next)
	}, [dispatch])

	useEffect(() => {
		const handler = (event: StorageEvent) => {
			if (event.key !== null && event.key !== SCRIPT_STORAGE_KEY) {
				return
			}
			const next = loadScriptStorage()
			dispatch(hydrateScript(next))
		}

		window.addEventListener('storage', handler)
		return () => window.removeEventListener('storage', handler)
	}, [dispatch])

	return null
}

export default ScriptStorageListener
