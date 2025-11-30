import { memo, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import type { WebSocketLog } from '@/telemetry/hooks/websocket'

import { useAppSelector } from 'app/hooks'

import NotificationHost, { NotificationHandle, NotificationMessage } from '../NotificationHost'

import NotificationMessages from './messages'

const SUPPRESS_DISCONNECT_DURATION = 2 * 60 * 1000

const NotificationController = function () {
	const intl = useIntl()
	const logs = useAppSelector(state => state.log.logs)
	const [previousTimestamp, setPreviousTimestamp] = useState(Date.now())
	const [previousDisconnectedTimestamp, setPreviousDisconnectedTimestamp] = useState(0)
	const savedRef = useRef<NotificationHandle>(null)

	useEffect(() => {
		const handler = savedRef.current
		if (!handler) {
			return
		}

		const targetIndex = logs.findIndex(function (log) {
			return log.timestamp > previousTimestamp
		})
		if (targetIndex === -1) {
			return
		}

		for (let i = targetIndex; i >= 0; --i) {
			const log = logs[i]

			let message: NotificationMessage
			switch (log.type) {
			case 'test':
				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationTestingNotification),
					description: intl.formatMessage(NotificationMessages.notificationSucceedToTestNotification),
				}
				break
			case 'websocket_connect':
				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationWebSocketConnected),
					description: (log as WebSocketLog).url,
				}
				break
			case 'websocket_disconnect': {
				const wslog = log as WebSocketLog
				const suppress = log.timestamp - previousDisconnectedTimestamp < SUPPRESS_DISCONNECT_DURATION
				if (!import.meta.env.DEV && suppress) {
					continue
				}
				setPreviousDisconnectedTimestamp(log.timestamp)

				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationWebSocketDisconnected),
					description: wslog.url,
				}
				break
			}
			default:
				continue
			}
			handler.publish(message)
		}
		setPreviousTimestamp(logs[0].timestamp)
	}, [logs])

	return <NotificationHost ref={savedRef} maxCount={3} />
}

export default memo(NotificationController)
