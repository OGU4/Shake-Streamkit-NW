import { useIntl } from 'react-intl'
import { connect } from 'react-redux'

import { ConditionalExcept } from 'type-fest'

import { type WaveType } from '@/core/utils/wave'

import type { RootState } from 'app/store'

import OverlayMessages from '../messages'
import { getCurrentWaves, selectWave } from '../selector'
import { showEggGraph } from '../slicers'

import WaveButton from './WaveButton'

interface WaveSelectorProps {
	readonly waves?: WaveType[]
	readonly selectedWave?: WaveType
	selectWave(wave?: WaveType): void
}

export const WaveSelector = function (props: WaveSelectorProps) {
	const {
		waves,
		selectedWave,
		selectWave,
	} = props
	const intl = useIntl()

	return (
		<>
			<button
				type='button'
				className='Button'
				disabled={selectedWave === undefined}
				onClick={() => selectWave()}
			>
				{intl.formatMessage(OverlayMessages.hideOverlay)}
			</button>
			{waves
				?.filter(wave => wave != 'extra')
				.map(wave => (
					<WaveButton
						key={wave}
						wave={wave}
						onWaveChange={selectWave}
						disabled={wave === selectedWave}
					/>
				))}
		</>
	)
}

function mapStateToProps(state: RootState) {
	return {
		waves: getCurrentWaves(state),
		selectedWave: selectWave(state),
	} satisfies ConditionalExcept<WaveSelectorProps, Function>
}

const actionCreators = {
	selectWave: showEggGraph,
}

export default connect(
	mapStateToProps,
	actionCreators,
)(WaveSelector)
