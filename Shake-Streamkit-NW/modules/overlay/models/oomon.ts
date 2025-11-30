export interface OomonSpawnAlertEvent {
	alertRemaining: number
	spawnRemaining: number
	nextSpawnRemaining: number | null
	isLast: boolean
	wave: number | 'extra'
}
