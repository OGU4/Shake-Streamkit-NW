import { memo } from 'react'

import { Axis, TickLabelProps } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { ScaleLinear } from 'd3-scale'

import type { ScaleInput } from '@visx/scale'

interface YAxisProps {
	readonly x?: number | undefined
	readonly y?: number | undefined
	readonly width: number
	readonly height: number
	readonly scale: ScaleLinear<number, number, never>
}

const amountLabelProps: TickLabelProps<ScaleInput<ScaleLinear<number, number, never>>> = Object.freeze({
	dx: -4,
	dy: '.4em',
	fontFamily: undefined,
	fontSize: undefined,
	fill: undefined,
})

export const YAxis = function (props: YAxisProps) {
	const {
		x = 0,
		y = 0,
		width,
		height,
		scale,
	} = props
	return (
		<>
			<GridRows
				left={x}
				top={y}
				width={width}
				height={height}
				className='EggGraph-grid EggGraph-grid-y'
				numTicks={2}
				scale={scale}
				shapeRendering={undefined}
			/>
			<Axis
				left={x}
				top={y}
				axisClassName='EggGraph-axis EggGraph-axis-y'
				hideZero
				numTicks={4}
				orientation='left'
				scale={scale}
				tickLength={4}
				tickLabelProps={amountLabelProps}
			/>
		</>
	)
}

export default memo(YAxis)
