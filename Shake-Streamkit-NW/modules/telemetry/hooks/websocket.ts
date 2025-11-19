import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { type Log, addLog } from '@/notification/slicers'
import { setMatch } from '@/overlay/slicers'

import { addTelemetry } from '../slicers'
import WebSocketWorker from '../utils/websocket.worker?worker'

import type { ShakeEvent } from '../models/telemetry'
import type { WebSocketWorkerEvent, WebSocketWorkerMessage } from '../utils/websocket.worker'
import type { Dispatch, UnknownAction } from 'redux'

export interface WebSocketLog extends Log {
	type: 'websocket_connect' | 'websocket_disconnect'
	url: string
	retryCount?: number
}

const handleWebSocketLog = (dispatch: Dispatch<UnknownAction>, log: WebSocketLog) => dispatch(addLog(log))

const useWebsocketTelemetry = (url: string) => {
	const [isConnect, setIsConnect] = useState(false)
	const dispatch = useDispatch()
	const dispatchWebSocketLog = handleWebSocketLog.bind(null, dispatch)

	useEffect(() => {
		const worker = new WebSocketWorker()
		worker.onmessage = (e: MessageEvent<WebSocketWorkerEvent<ShakeEvent>>) => {
			const event = e.data
			switch (event.type) {
			case 'connect':
				setIsConnect(true)
				dispatchWebSocketLog({
					type: 'websocket_connect',
					timestamp: event.timestamp,
					url,
				})
				break
			case 'disconnect':
				dispatchWebSocketLog({
					type: 'websocket_disconnect',
					timestamp: event.timestamp,
					url,
					retryCount: event.retryCount,
				})
				setIsConnect(false)
				break
			case 'message':
				dispatch(addTelemetry(event.data))
				if (event.data.event === 'matchmaking') {
					dispatch(setMatch(event.data.session))
				}
				break
			}
		}

		worker.postMessage({
			type: 'connect',
			url,
			connectionTimeout: 15000,
			minUptime: 30000,
		} as WebSocketWorkerMessage)

		return () => {
			worker.postMessage({
				type: 'disconnect',
			} as WebSocketWorkerMessage)
			worker.terminate()
		}
	}, [url])

	return isConnect
}

export default useWebsocketTelemetry
