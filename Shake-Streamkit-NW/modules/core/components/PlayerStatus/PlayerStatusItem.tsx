import { memo } from 'react'

import { ScaleLinear } from 'd3-scale'

import { ShakePlayerWave } from '@/telemetry/models/data'

const strokeWidth = 3

export interface PlayerStatusItemProps {
	readonly y: number
	readonly start: number
	readonly player: ShakePlayerWave
	readonly scale: ScaleLinear<number, number, never>
}

const PlayerStatusItem = function ({ y, start, player, scale }: PlayerStatusItemProps) {
	return (
		<g transform={`translate(0,${y})`}>
			<line
				className='EggGraph-axis-line'
				strokeLinecap='square'
				x2={-4}
			/>
			<text
				className='EggGraph-axis-text EggGraph-axis-y-text EggGraph-player-name'
				x={-4}
				dx={-4}
				dy='.4em'
			>
				#
				{player.index + 1}
			</text>
			{player.alives.map(function (alive) {
				return (
					<g key={alive[0]}>
						<line
							className='EggGraph-player-item-alive-bg'
							x1={scale(100 + start - alive[0])}
							x2={scale(100 + start - alive[1])}
						/>
						<line
							className='EggGraph-player-item-alive'
							x1={scale(100 + start - alive[0])}
							x2={scale(100 + start - alive[1])}
						/>
					</g>
				)
			})}
			{player.geggs.map(function (gegg) {
				return (
					<line
						key={gegg[0]}
						className='EggGraph-player-item-gegg'
						x1={scale(100 + start - gegg[0])}
						x2={scale(100 + start - gegg[1])}
						y1={-strokeWidth}
						y2={-strokeWidth}
					/>
				)
			})}
		</g>
	)
}

export default memo(PlayerStatusItem)
