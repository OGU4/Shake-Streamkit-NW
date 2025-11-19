import { defineMessages } from 'react-intl'

const NotificationMessages = defineMessages({
	notificationTestingNotification: {
		id: 'Notification.notificationTest',
		defaultMessage: 'Testing Notification',
	},
	notificationSucceedToTestNotification: {
		id: 'Notification.succeedToTestNotification',
		defaultMessage: 'The testing notification was sent successfully.',
	},
	notificationWebSocketConnected: {
		id: 'Notification.webSocketConnected',
		defaultMessage: 'Connected to WebSocket Server',
	},
	notificationWebSocketDisconnected: {
		id: 'Notification.webSocketDisconnected',
		defaultMessage: 'Failed to Connect to WebSocket Server',
	},
	notificationWaveAlertTitle: {
		id: 'Notification.waveAlertTitle',
		defaultMessage: '20 seconds remaining',
	},
	notificationWaveAlertDescription: {
		id: 'Notification.waveAlertDescription',
		defaultMessage: 'Wave {wave} for session {matchId} dropped below {threshold}s.',
	},
})

export default NotificationMessages
