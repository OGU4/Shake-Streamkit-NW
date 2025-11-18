import './styles.css'

import { memo, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'

import WebSocketStatus from '@/telemetry/components/WebSocketStatus'

import OverlayMessages from '@/overlay/messages'
import MatchSelector from '../MatchSelector'
import WaveSelector from '../WaveSelector'

export const OverlayController = function () {
	const intl = useIntl()
	const websocketStatusPositive = useCallback(function () {
		return (
			<>
				<CheckIcon className='Icon16' />
				{intl.formatMessage(OverlayMessages.connected)}
			</>
		)
	}, [intl])

	return (
		<>
			<MatchSelector />
			<WaveSelector />

			<div className='Overlay-last'>
				<WebSocketStatus
					positiveChildren={websocketStatusPositive}
					negativeChildren={(
						<>
							<XMarkIcon className='Icon16' />
							{intl.formatMessage(OverlayMessages.notConnected)}
						</>
					)}
				/>
				<footer>
					ShakeStreamKit. © 2024 mntone (GPLv3)
				</footer>
			</div>
		</>
	)
}

export default memo(OverlayController)
