import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'

import CheckBox from '@/core/components/CheckBox'
import SliderBox from '@/core/components/SliderBox'
import { setMatch } from '@/overlay/slicers'
import WebSocketStatus from '@/telemetry/components/WebSocketStatus'
import { ShakeEvent } from '@/telemetry/models/telemetry'
import { setTelemetry } from '@/telemetry/slicers'
import { RealtimeTelemetrySimulator } from '@/telemetry/utils/simulator'

import { useAppSelector } from 'app/hooks'

import FileInput from '../components/FileInput'
import ServerAddressBox from '../components/ServerAddressBox'
import DialogMessages from '../messages'
import { setSimulation, setSpeed } from '../slicers'

const DataSourcePage = function () {
	const intl = useIntl()

	const simulationEnabled = useAppSelector(state => state.config.simulation) === true
	const simulationSpeed = useAppSelector(state => state.config.speed) ?? 2.0

	const websocketStatusPositive = useCallback(function (url: string) {
		return (
			<>
				<CheckIcon className='Icon16' />
				{intl.formatMessage(
					DialogMessages.dataSourceConnected,
					{ url },
				)}
			</>
		)
	}, [intl])

	const dispatch = useDispatch()
	const simulator = new RealtimeTelemetrySimulator(dispatch, simulationSpeed)

	const handleSimulation = useCallback(function (simulation: boolean) {
		dispatch(setSimulation(simulation))
	}, [dispatch])
	const handleSpeed = useCallback(function (speed: number) {
		dispatch(setSpeed(speed))
	}, [dispatch])
	const handleFileChange = function (telemetry: Readonly<ShakeEvent>[]) {
		if (simulationEnabled) {
			simulator.play(telemetry)
		} else {
			dispatch(setTelemetry(telemetry))
			dispatch(setMatch(telemetry[0].session))
		}
	}

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.dataSource)}
			</h2>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.dataSourceServerAddress)}
				</h3>
				<ServerAddressBox />
				<p>
					<WebSocketStatus
						positiveChildren={websocketStatusPositive}
						negativeChildren={(
							<>
								<XMarkIcon className='Icon16' />
								{intl.formatMessage(DialogMessages.dataSourceNotConnected)}
							</>
						)}
					/>
				</p>
			</section>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.dataSourceFileInput)}
				</h3>
				<FileInput onFileChange={handleFileChange} />
			</section>

			<section className='Form-group'>
				<h4>
					{intl.formatMessage(DialogMessages.dataSourcePlaybackOptions)}
				</h4>
				<CheckBox
					id='reduced'
					checked={simulationEnabled}
					onCheckedChange={handleSimulation}
				>
					{intl.formatMessage(DialogMessages.dataSourceSimulationPlayback)}
				</CheckBox>
				<SliderBox
					min={0.5}
					max={10}
					step={0.5}
					value={simulationSpeed}
					unit={intl.formatMessage(DialogMessages.dataSourceSimulationSpeedUnit)}
					onValueChange={handleSpeed}
				/>
			</section>
		</>
	)
}

export default DataSourcePage
