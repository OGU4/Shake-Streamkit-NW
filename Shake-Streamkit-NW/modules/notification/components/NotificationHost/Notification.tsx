import { memo } from 'react'

import { XMarkIcon } from '@heroicons/react/16/solid'
import * as ToastPrimitive from '@radix-ui/react-toast'

interface NotificationProps {
	readonly timestamp: number
	readonly title: string
	readonly description?: string
	readonly duration?: number
	onClose?(timestamp: number): void
}

const Notification = (props: NotificationProps) => {
	const {
		timestamp,
		title,
		description,
		duration = 5000,
		onClose,
	} = props

	const handleOpen = (open: boolean) => {
		if (!open) {
			onClose?.call(this, timestamp)
		}
	}

	return (
		<ToastPrimitive.Root
			className='Notification'
			duration={duration}
			onOpenChange={handleOpen}
		>
			<ToastPrimitive.Title className='ToastTitle'>
				{title}
			</ToastPrimitive.Title>
			<ToastPrimitive.Description className='Notification-description'>
				{description}
			</ToastPrimitive.Description>
			<ToastPrimitive.Close
				aria-label='Close'
				className='Notification-close'
				tabIndex={-1}
			>
				<XMarkIcon className='Icon16' />
			</ToastPrimitive.Close>
		</ToastPrimitive.Root>
	)
}

export default memo(Notification)
