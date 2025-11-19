import { ReactNode, useContext } from 'react'

import { WebSocketContext } from './WebSocketProvider'

interface WebSocketStatusProps {
	positiveChildren?: (url: string) => ReactNode | undefined
	negativeChildren?: ReactNode | undefined
}

const WebSocketStatus = function (props: WebSocketStatusProps) {
	const {
		positiveChildren,
		negativeChildren,
	} = props

	const wsConnect = useContext(WebSocketContext)
	const isConnected = wsConnect?.isConnect === true
	if (isConnected && positiveChildren === undefined) {
		return null
	}
	if (!isConnected && negativeChildren === undefined) {
		return null
	}

	return wsConnect && (
		<span className={`StatusText StatusText-${isConnected ? 'positive' : 'negative'}`}>
			{isConnected ? positiveChildren!(wsConnect.url) : negativeChildren}
		</span>
	)
}

export default WebSocketStatus
