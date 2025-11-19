import { PropsWithChildren, SVGProps, memo } from 'react'

type HLineLabelPosition =
	| 'topLeft'
	| 'top'
	| 'topRight'
	| 'bottomLeft'
	| 'bottom'
	| 'bottomRight'

interface HLineProps {
	readonly className?: string | undefined
	readonly x?: number | undefined
	readonly y?: number | undefined
	readonly width: number
	readonly labelPosition?: HLineLabelPosition | undefined
}

type LabelPositionProps = Pick<SVGProps<SVGTextElement>, 'x' | 'dx' | 'dy'>

function getLabelPositionProps(props: Pick<HLineProps, 'width' | 'labelPosition'>): LabelPositionProps {
	const ret: LabelPositionProps = {}
	switch (props.labelPosition) {
	case 'top':
	case 'bottom':
		ret.x = Math.floor(0.5 * props.width)
		break
	case 'topRight':
	case 'bottomRight':
		ret.x = props.width
		ret.dx = '-.2em'
		break
	default:
		ret.dx = '.2em'
		break
	}
	switch (props.labelPosition) {
	case 'bottomLeft':
	case 'bottom':
	case 'bottomRight':
		ret.dy = '1.2em'
		break
	default:
		ret.dy = '-.333em'
		break
	}
	return ret
}

export const HLine = function (props: PropsWithChildren<HLineProps>) {
	const {
		className,
		x = 0,
		y = 0,
		width,
		children,
	} = props
	return (
		<>
			<line
				className={className ? `${className}-line` : undefined}
				x1={x}
				x2={x + width}
				y1={y}
				y2={y}
			/>
			<text
				className={className ? `${className}-text` : undefined}
				y={y}
				dx='.2em'
				{...getLabelPositionProps(props)}
			>
				{children}
			</text>
		</>
	)
}

export default memo(HLine)
