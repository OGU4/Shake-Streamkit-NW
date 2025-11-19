import { FC, PropsWithChildren, createContext } from 'react'

import { useEnvironment } from '@/core/components/EnvironmentProvider'

import { useAppSelector } from 'app/hooks'

import useWebsocketTelemetry from '../hooks/websocket'

interface WebSocketContextType {
	url: string
	isConnect: boolean
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null)

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
	const protocol = useEnvironment()?.secure === true ? 'wss://' : 'ws://'
	const server = useAppSelector(state => state.config.server)
	const url = protocol + (server ?? import.meta.env.VITE_WS_SERVER)

	const isConnect = useWebsocketTelemetry(url)
	return (
		<WebSocketContext.Provider value={{ url, isConnect }}>
			{children}
		</WebSocketContext.Provider>
	)
}

export default WebSocketProvider
