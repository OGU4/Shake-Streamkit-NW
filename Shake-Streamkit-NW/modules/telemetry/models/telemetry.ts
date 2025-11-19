import { ShakeColor, ShakeKing, ShakeStage } from './constant'

export interface ShakeBaseEvent {
	readonly session: string
	readonly event: string
	readonly timestamp: number
}

export type ShakeMatchmakingEvent = ShakeBaseEvent & {
	readonly event: 'matchmaking'
}

export type ShakeGameStageEvent = ShakeBaseEvent & {
	readonly event: 'game_stage'
	readonly stage: ShakeStage
}

export type ShakeGameKingEvent = ShakeBaseEvent & {
	readonly event: 'game_king'
	readonly king: ShakeKing
}

export interface ShakeGamePlayerUpdateEvent {
	readonly alive: boolean
	readonly gegg: boolean
}

export type ShakeGameUpdateEvent = ShakeBaseEvent & {
	readonly event: 'game_update'
	readonly color: ShakeColor
	readonly count?: number
	readonly players: ShakeGamePlayerUpdateEvent[]
	readonly unstable: boolean
} & ({
	readonly wave?: number
	readonly amount?: number
	readonly quota: number
} | {
	readonly wave: 'extra'
})

export type ShakeGameResultEvent = ShakeBaseEvent & {
	readonly event: 'game_result'
	readonly golden: number
	readonly power: number
}

export type ShakeGameErrorEvent = ShakeBaseEvent & {
	readonly event: 'game_error'
}

export type ShakeEvent =
	| ShakeMatchmakingEvent
	| ShakeGameStageEvent
	| ShakeGameKingEvent
	| ShakeGameUpdateEvent
	| ShakeGameResultEvent
	| ShakeGameErrorEvent
