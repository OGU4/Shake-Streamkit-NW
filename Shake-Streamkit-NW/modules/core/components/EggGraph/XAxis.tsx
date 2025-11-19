import { memo } from 'react'

import { Axis, TickLabelProps } from '@visx/axis'
import { ScaleLinear } from 'd3-scale'

import type { ScaleInput } from '@visx/scale'

interface XAxisProps {
	readonly x?: number | undefined
	readonly y?: number | undefined
	readonly scale: ScaleLinear<number, number, never>
}

const countLabelProps: TickLabelProps<ScaleInput<ScaleLinear<number, number, never>>> = Object.freeze({
	dy: '.6em',
	fontFamily: undefined,
	fontSize: undefined,
	fill: undefined,
})

export const XAxis = function (props: XAxisProps) {
	const {
		x = 0,
		y = 0,
		scale,
	} = props
	return (
		<Axis
			left={x}
			top={y}
			axisClassName='EggGraph-axis EggGraph-axis-x'
			scale={scale}
			numTicks={4}
			tickLength={4}
			tickLabelProps={countLabelProps}
			tickValues={[100, 75, 50, 25, 0]}
		/>
	)
}

export default memo(XAxis)
