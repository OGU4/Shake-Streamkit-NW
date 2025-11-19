import './styles.css'

import { UIEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import * as ToastPrimitive from '@radix-ui/react-toast'

import Notification from './Notification'

export interface NotificationHandle {
	publish(notification: NotificationMessage): void
}

export interface NotificationMessage {
	readonly timestamp: number
	readonly title: string
	readonly description?: string
	readonly duration?: number
}

export interface NotificationHostProps {
	maxCount?: number
}

export const NotificationHost = forwardRef<NotificationHandle, NotificationHostProps>(function NotificationHost({ maxCount }, forwardedRef) {
	const ref = useRef<HTMLOListElement>(null)
	const [isBottom, setIsBottom] = useState(true)
	const [notifications, setNotifications] = useState<NotificationMessage[]>([])

	useImperativeHandle(forwardedRef, function () {
		return {
			publish(notification: NotificationMessage) {
				const length = notifications.length + 1
				if (maxCount && length > maxCount) {
					const newNotifications = notifications.slice(length - maxCount)
					newNotifications.push(notification)
					setNotifications(newNotifications)
				} else {
					const newNotifications = [...notifications, notification]
					setNotifications(newNotifications)
				}
			},
		} satisfies NotificationHandle
	})

	useEffect(function () {
		if (isBottom && ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight
		}
	}, [notifications])

	const handleScroll = function (e: UIEvent) {
		const target = e.currentTarget
		const availableTop = target.scrollHeight - target.clientHeight
		setIsBottom(target.scrollTop === availableTop)
	}

	const handleClose = useCallback(function (timestamp: number) {
		setNotifications(function (notifications) {
		const index = notifications.findIndex(n => n.timestamp === timestamp)
			if (index !== -1) {
				const newNotifications = notifications.slice(0)
				newNotifications.splice(index, 1)
				return newNotifications
			}
			return notifications
		})
	}, [setNotifications])

	return (
		<ToastPrimitive.Provider swipeDirection='right'>
			<>
				{notifications.map(function (notification) {
					return (
						<Notification
							key={notification.timestamp}
							onClose={handleClose}
							{...notification}
						/>
					)
				})}
			</>
			<ToastPrimitive.Viewport
				className='NotificationHost'
				ref={ref}
				onScroll={handleScroll}
			/>
		</ToastPrimitive.Provider>
	)
})

export default NotificationHost
