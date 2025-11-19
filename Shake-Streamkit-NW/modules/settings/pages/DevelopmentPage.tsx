import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import { useEnvironment } from '@/core/components/EnvironmentProvider'
import { addLog } from '@/notification/slicers'

import CameraSelector from '../components/CameraSelector'
import DialogMessages from '../messages'

const DevelopmentPage = function () {
	const intl = useIntl()
	const environment = useEnvironment()
	const broadcastEnabled = environment && 'broadcast' in environment

	const dispatch = useDispatch()
	const notifyTest = function () {
		dispatch(addLog({
			type: 'test',
			timestamp: Date.now(),
		}))
	}

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.development)}
			</h2>

			{!broadcastEnabled && (
				<section className='Form-group'>
					<h3>
						{intl.formatMessage(DialogMessages.developmentPreview)}
					</h3>
					<p className='Form-description'>
						{intl.formatMessage(DialogMessages.developmentUseCamera)}
					</p>
					<CameraSelector />
				</section>
			)}

			{import.meta.env.DEV && (
				<section className='Form-group'>
					<h3>
						{intl.formatMessage(DialogMessages.developmentNotification)}
					</h3>
					<button
						type='button'
						className='Button'
						onClick={notifyTest}
					>
						{intl.formatMessage(DialogMessages.developmentTestNotifications)}
					</button>
				</section>
			)}

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.developmentEnvironment)}
				</h3>
				<p>
					{intl.formatMessage(
						DialogMessages.developmentBroadcastMode,
						{ status: broadcastEnabled
							? intl.formatMessage(DialogMessages.developmentBroadcastModeEnabled)
							: intl.formatMessage(DialogMessages.developmentBroadcastModeDisabled),
						},
					)}
				</p>
				{environment?.broadcast && (
					<p>
						{intl.formatMessage(
							DialogMessages.developmentBroadcastSoftware,
							{ software: environment.broadcast.friendlyName + ' ' + environment.broadcast.version },
						)}
					</p>
				)}
			</section>
		</>
	)
}

export default DevelopmentPage
