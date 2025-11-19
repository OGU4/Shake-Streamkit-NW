import { ScaleLinear } from 'd3-scale'

import { ShakeDefaultWave } from '@/telemetry/models/data'

import { GraphLayoutProps } from '@/core/models/graph'

import PlayerStatusItem from './PlayerStatusItem'

// Spacing between player status item and golden egg graph
const playerStatusItemHeight = 20
const playerStatusItemHeightHalf = 0.5 * playerStatusItemHeight

export const PlayerStatusGraphHeight = 4 * playerStatusItemHeight

interface PlayerStatusProps extends Omit<GraphLayoutProps, 'height'> {
	readonly data: Readonly<ShakeDefaultWave>
	readonly scale: ScaleLinear<number, number, never>
	readonly visible?: boolean
}

const PlayerStatus = function (props: PlayerStatusProps) {
	const {
		marginTop: y,
		marginLeft: x,
		width,

		data,
		scale,
		visible,
	} = props

	return visible && (
		<g transform={`translate(${x},${y})`}>
			<rect
				className='EggGraph-background'
				width={width}
				height={PlayerStatusGraphHeight}
			/>
			<line className='EggGraph-axis-line' y2={PlayerStatusGraphHeight} />
			{data.players.map(function (p, i) {
				return (
					<PlayerStatusItem
						key={i}
						y={playerStatusItemHeightHalf + playerStatusItemHeight * i}
						start={data.startTimestamp}
						player={p}
						scale={scale}
					/>
				)
			})}
		</g>
	)
}

export default PlayerStatus
