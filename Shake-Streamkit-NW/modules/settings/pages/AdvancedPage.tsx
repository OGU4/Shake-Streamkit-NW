import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'
import { useEnvironment } from '@/core/components/EnvironmentProvider'
import SliderBox from '@/core/components/SliderBox'

import { useAppSelector } from 'app/hooks'

import DialogMessages from '../messages'
import {
	setColorLock,
	setJoeAlertEnabled,
	setLastSpawnAlertEnabled,
	setNotifyOnQuotaMetDuration,
	setNotifyOnWaveFinishedDuration,
	setOomonAlertEnabled,
	setReduced,
	setStatus,
} from '../slicers'

const AdvancedPage = function () {
	const intl = useIntl()
	const unit = intl.formatMessage(DialogMessages.advancedDisplayDurationUnit)

	const notifyOnQuotaMet = useAppSelector(state => state.config.notifyOnQuotaMet)
	const notifyOnQuotaMetDuration = useAppSelector(state => state.config.notifyOnQuotaMetDuration) ?? 3.0
	const notifyOnWaveFinished = useAppSelector(state => state.config.notifyOnWaveFinished)
	const notifyOnWaveFinishedDuration = useAppSelector(state => state.config.notifyOnWaveFinishedDuration) ?? 12.0

	let reducedEnabled = useAppSelector(state => state.config.reduced)
	if (reducedEnabled === undefined) {
		reducedEnabled = useEnvironment()?.reduced
		if (reducedEnabled === undefined) {
			reducedEnabled = false
		}
	}

	const colorLocked = useAppSelector(state => state.config.colorLock) ?? false
	const playerStatusEnabled = useAppSelector(state => state.config.status) ?? false
	let lastSpawnAlertEnabled = useAppSelector(state => state.config.lastSpawnAlertEnabled)
	if (lastSpawnAlertEnabled === undefined) {
		lastSpawnAlertEnabled = true
	}
	let oomonAlertEnabled = useAppSelector(state => state.config.oomonAlertEnabled)
	if (oomonAlertEnabled === undefined) {
		oomonAlertEnabled = false
	}
	let joeAlertEnabled = useAppSelector(state => state.config.joeAlertEnabled)
	if (joeAlertEnabled === undefined) {
		joeAlertEnabled = false
	}

	const dispatch = useDispatch()
	const handleNotifyOnQuotaMetDuration = useCallback(function (notifyOnQuotaMetDuration: number) {
		dispatch(setNotifyOnQuotaMetDuration(notifyOnQuotaMetDuration))
	}, [dispatch])
	const handleNotifyOnWaveFinishedDuration = useCallback(function (notifyOnWaveFinishedDuration: number) {
		dispatch(setNotifyOnWaveFinishedDuration(notifyOnWaveFinishedDuration))
	}, [dispatch])
	const handleReduced = useCallback(function (reduced: boolean) {
		dispatch(setReduced(reduced))
	}, [dispatch])
	const handleColorLock = useCallback(function (colorLocked: boolean) {
		dispatch(setColorLock(colorLocked))
	}, [dispatch])
	const handleLastSpawnAlert = useCallback(function (enabled: boolean) {
		dispatch(setLastSpawnAlertEnabled(enabled))
	}, [dispatch])
	const handleOomonAlert = useCallback(function (enabled: boolean) {
		dispatch(setOomonAlertEnabled(enabled))
	}, [dispatch])
	const handleJoeAlert = useCallback(function (enabled: boolean) {
		dispatch(setJoeAlertEnabled(enabled))
	}, [dispatch])
	const handlePlayerStatus = useCallback(function (playerStatusEnabled: boolean) {
		dispatch(setStatus(playerStatusEnabled))
	}, [dispatch])

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.advanced)}
			</h2>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.advancedDisplayDuration)}
				</h3>
				<h4>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnQuotaMet)}
				</h4>
				<SliderBox
					disabled={!notifyOnQuotaMet}
					min={0.1}
					max={15}
					step={0.1}
					value={notifyOnQuotaMetDuration}
					unit={unit}
					onValueChange={handleNotifyOnQuotaMetDuration}
				/>
				<h4>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnWaveFinished)}
				</h4>
				<SliderBox
					disabled={notifyOnWaveFinished === false}
					min={0.1}
					max={15}
					step={0.1}
					value={notifyOnWaveFinishedDuration}
					unit={unit}
					onValueChange={handleNotifyOnWaveFinishedDuration}
				/>
			</section>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.advancedOtherOptions)}
				</h3>
				<CheckBox
					id='playerstatus'
					checked={playerStatusEnabled}
					onCheckedChange={handlePlayerStatus}
				>
					{intl.formatMessage(DialogMessages.advancedPlayerStatus)}
				</CheckBox>
				<CheckBox
					id='reduced'
					checked={reducedEnabled}
					onCheckedChange={handleReduced}
				>
					{intl.formatMessage(DialogMessages.advancedReduceAnimations)}
				</CheckBox>
				<CheckBox
					id='colorlock'
					checked={colorLocked}
					onCheckedChange={handleColorLock}
				>
					{intl.formatMessage(DialogMessages.advancedColorLock)}
				</CheckBox>
				<CheckBox
					id='oomonalert'
					checked={oomonAlertEnabled}
					onCheckedChange={handleOomonAlert}
				>
					{intl.formatMessage(DialogMessages.advancedOomonAlert)}
				</CheckBox>
				<CheckBox
					id='lastspawnalert'
					checked={lastSpawnAlertEnabled}
					onCheckedChange={handleLastSpawnAlert}
					>
						{intl.formatMessage(DialogMessages.advancedLastSpawnAlert)}
					</CheckBox>
					<CheckBox
						id='joealert'
						checked={joeAlertEnabled}
						onCheckedChange={handleJoeAlert}
					>
						{intl.formatMessage(DialogMessages.advancedJoeAlert)}
					</CheckBox>
				</section>
			</>
		)
	}

export default AdvancedPage
