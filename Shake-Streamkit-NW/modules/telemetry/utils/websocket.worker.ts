import ReconnectingWebSocket, { type UrlProvider } from 'reconnecting-websocket'

import type { CloseEvent, Event } from 'reconnecting-websocket/dist/events'

export type WebSocketWorkerMessage =
	| {
		type: 'connect'
		url: UrlProvider
		connectionTimeout?: number
		minUptime?: number
	}
	| { type: 'disconnect' }

export type WebSocketWorkerEvent<T> =
	| { type: 'connect', timestamp: number }
	| { type: 'disconnect', timestamp: number, retryCount: number }
	| { type: 'message', timestamp: number, data: T }

const worker: Worker = self as any

function postMessage(event: WebSocketWorkerEvent<any>) {
	worker.postMessage(event)
}

function handleOpen(_: Event) {
	postMessage({
		type: 'connect',
		timestamp: Date.now(),
	})
}

function handleClose(e: CloseEvent) {
	const socket = e.target as ReconnectingWebSocket
	postMessage({
		type: 'disconnect',
		timestamp: Date.now(),
		retryCount: socket.retryCount,
	})
}

function handleMessage(e: MessageEvent) {
	const json = JSON.parse(e.data)
	postMessage({
		type: 'message',
		timestamp: Date.now(),
		data: json,
	})
}

let socket: ReconnectingWebSocket | undefined = undefined
function closeWebSocket() {
	const ws = socket
	if (ws) {
		ws.close()
		ws.removeEventListener('open', handleOpen)
		ws.removeEventListener('close', handleClose)
		ws.removeEventListener('message', handleMessage)
		socket = undefined
	}
}

worker.addEventListener('message', (e: MessageEvent<WebSocketWorkerMessage>) => {
	const message = e.data
	switch (message.type) {
	case 'connect': {
		closeWebSocket()

		const ws = new ReconnectingWebSocket(message.url, undefined, {
			connectionTimeout: message.connectionTimeout ?? 5000,
			minUptime: message.minUptime ?? 5000,
		})
		ws.addEventListener('open', handleOpen)
		ws.addEventListener('close', handleClose)
		ws.addEventListener('message', handleMessage)
		socket = ws
		break
	}
	case 'disconnect':
		closeWebSocket()
		break
	}
})

export default worker
