import { Dispatch, MiddlewareAPI, UnknownAction } from 'redux'

import { RootState } from 'app/store'

import { addLog, cleanupLogs } from '../slicers'

const autoCleanupLogs = function (store: MiddlewareAPI<Dispatch, RootState>) {
	return function (next: Dispatch) {
		return function (action: UnknownAction) {
			const result = next(action)

			const inAddLog = addLog.match(action)
			if (inAddLog) {
				store.dispatch(cleanupLogs())
			}

			return result
		}
	}
}

export default autoCleanupLogs
