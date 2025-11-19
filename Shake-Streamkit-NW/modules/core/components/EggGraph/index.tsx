import './styles.css'

import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { curveLinear } from '@visx/curve'
import { scaleLinear } from '@visx/scale'
import { LinePath } from '@visx/shape'

import { getSvgProps, type GraphRootProps } from '@/core/models/graph'
import { forceLast } from '@/core/utils/collection'
import type { ShakeDefaultWave, ShakeTelemetry } from '@/telemetry/models/data'

import PlayerStatus, { PlayerStatusGraphHeight } from '../PlayerStatus'

import HLine from './HLine'
import Header from './Header'
import XAxis from './XAxis'
import YAxis from './YAxis'
import EggGraphMessages from './messages'

export interface EggGraphProps extends GraphRootProps {
	readonly colorLock?: boolean
	readonly status?: boolean
	readonly telemetry?: Readonly<ShakeTelemetry>
	readonly wave?: Readonly<ShakeDefaultWave>
}

const EggGraph = function (props: EggGraphProps) {
	const {
		marginTop: y,
		marginLeft: x,
		marginRight,
		width,
		height,

		colorLock,
		status: statusVisible,
		telemetry,
		wave: waveData,
	} = props
	if (waveData === undefined) {
		return null
	}

	const intl = useIntl()

	const offsetY = statusVisible ? PlayerStatusGraphHeight + 16 : 0
	const svgProps = getSvgProps(props)
	const transform = `translate(${x},${y + offsetY})`

	const lastUpdate = forceLast(waveData.updates)
	const status = waveData.quota <= lastUpdate.amount
		? true
		: lastUpdate.count === 0
			? false
			: telemetry?.closed
				? false
				: undefined
	const maxY = Math.max(5 * Math.ceil(0.2 * waveData.quota), lastUpdate.amount)
	const graphHeight = height - offsetY
	const amountScale = useMemo(() => scaleLinear<number>({
		domain: [maxY, 0],
		range: [0, graphHeight],
		nice: true,
	}), [graphHeight, maxY])
	const countScale = useMemo(() => scaleLinear<number>({
		domain: [100, 0],
		range: [0, width],
		clamp: true,
	}), [width])

	return (
		<div className={colorLock !== true && telemetry?.color
			? `EggGraph EggGraph-ink-${telemetry.color}`
			: `EggGraph`}>
			<Header
				wave={waveData.wave}
				status={status}
				amount={waveData.amount}
				quota={waveData.quota}
			/>

			<svg {...svgProps}>
				<PlayerStatus
					marginTop={y}
					marginLeft={x}
					marginRight={marginRight}
					width={width}
					data={waveData}
					scale={countScale}
					visible={statusVisible}
				/>

				<rect
					className='EggGraph-background'
					x={x}
					y={y + offsetY}
					width={width}
					height={graphHeight}
				/>

				<YAxis
					x={x}
					y={y + offsetY}
					width={width}
					height={graphHeight}
					scale={amountScale}
				/>
				<XAxis
					x={x}
					y={y + height}
					scale={countScale}
				/>

				<g className='EggGraph-hline-quota' transform={transform}>
					<HLine
						y={amountScale(waveData.quota)}
						width={width}
						labelPosition={waveData.quota + 3 > maxY ? 'bottomLeft' : 'topLeft'}
					>
						{intl.formatMessage(EggGraphMessages.quota)}
					</HLine>
				</g>

				<g transform={transform}>
					<LinePath
						className='EggGraph-item-line-bg'
						data={waveData.updates}
						curve={curveLinear}
						strokeLinecap={undefined}
						y={d => amountScale(d.amount)}
						x={d => countScale(100 + waveData.startTimestamp - d.timestamp)}
					/>
					<LinePath
						className='EggGraph-item EggGraph-item-line'
						data={waveData.updates}
						curve={curveLinear}
						strokeLinecap={undefined}
						y={d => amountScale(d.amount)}
						x={d => countScale(100 + waveData.startTimestamp - d.timestamp)}
					/>
				</g>
			</svg>
		</div>
	)
}

export default EggGraph
