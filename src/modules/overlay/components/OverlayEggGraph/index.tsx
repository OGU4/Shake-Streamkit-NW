import './styles.css'

import { useRef } from 'react'
import { connect } from 'react-redux'

import EggGraph, { type EggGraphProps } from '@/core/components/EggGraph'
import type { GraphRootProps } from '@/core/models/graph'

import { RootState } from 'app/store'

import { getCurrentTelemetry, getCurrentWaveFromTelemetry } from '@/overlay/selector'
import { RightSlideAnimation } from '../SlideAnimation'

const preferredGraphLayout = Object.freeze({
	marginTop: 48,     // 3.0em  in 720p (1em = 16px @ 720p, 1em = 24px @ 1080p)
	marginLeft: 44,    // 2.75em in 720p
	marginRight: 12,   // 0.75em in 720p, with 3em padding
	marginBottom: 32,  // 2.0em  in 720p

	width: 320 - 44 - 12,
	height: 192 - 48 - 32,
	containerWidth: '100%',
	containerHeight: '100%',
} satisfies GraphRootProps)

const preferredGraphLayoutWithStatus = Object.freeze({
	marginTop: 48,     // 3.0em  in 720p (1em = 16px @ 720p, 1em = 24px @ 1080p)
	marginLeft: 44,    // 2.75em in 720p
	marginRight: 12,   // 0.75em in 720p, with 3em padding
	marginBottom: 32,  // 2.0em  in 720p

	width: 352 - 44 - 12,
	height: 288 - 48 - 32,
	containerWidth: '100%',
	containerHeight: '100%',
} satisfies GraphRootProps)

type OverlayEggGraphProps =
	& { readonly visible: boolean }
	& Omit<EggGraphProps, keyof GraphRootProps>

export const OverlayEggGraph = function (props: OverlayEggGraphProps) {
	const { status, visible, ...nextProps } = props
	const ref = useRef<HTMLDivElement>(null)
	return (
		<RightSlideAnimation
			nodeRef={ref}
			rich
			visible={visible}
		>
			<div className={`Overlay Overlay-right OverlayEggGraph${status ? ' OverlayEggGraph-status' : ''}`} ref={ref}>
				<EggGraph
					status={status}
					{...nextProps}
					{...status ? preferredGraphLayoutWithStatus : preferredGraphLayout}
				/>
			</div>
		</RightSlideAnimation>
	)
}

function mapStateToProps(state: RootState) {
	const telemetry = getCurrentTelemetry(state)
	let wave = getCurrentWaveFromTelemetry(state, telemetry)
	if (wave?.wave === 'extra') {
		wave = undefined
	}

	return {
		colorLock: state.config.colorLock,
		telemetry,
		status: state.config.status ?? false,
		visible: telemetry !== undefined && wave !== undefined,
		wave,
	} satisfies OverlayEggGraphProps
}

export default connect(
	mapStateToProps,
)(OverlayEggGraph)
