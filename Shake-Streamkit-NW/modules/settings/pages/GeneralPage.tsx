import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'
import { useEnvironment } from '@/core/components/EnvironmentProvider'

import { useAppSelector } from 'app/hooks'

import LanguageSelector from '../components/LanguageSelector'
import DialogMessages from '../messages'
import {
	setAutoHide,
	setLanguage,
	setNotifyOnQuotaMet,
	setNotifyOnWaveFinished,
} from '../slicers'

const GeneralPage = () => {
	const intl = useIntl()
	const autoHide = useAppSelector(state => state.config.autoHide)
	const notifyOnQuotaMet = useAppSelector(state => state.config.notifyOnQuotaMet)
	const notifyOnWaveFinished = useAppSelector(state => state.config.notifyOnWaveFinished)

	const userLanguage = useEnvironment()?.lang ?? 'en'
	const language = useAppSelector(state => state.config.language) ?? userLanguage

	const dispatch = useDispatch()
	const handleAutoHide = useCallback((autoHide: boolean) => {
		dispatch(setAutoHide(autoHide))
	}, [dispatch])
	const handleNotifyOnQuotaMet = useCallback((notifyOnQuotaMet: boolean) => {
		dispatch(setNotifyOnQuotaMet(notifyOnQuotaMet))
	}, [dispatch])
	const handleNotifyOnWaveFinished = useCallback((notifyOnWaveFinished: boolean) => {
		dispatch(setNotifyOnWaveFinished(notifyOnWaveFinished))
	}, [dispatch])
	const handleLanguageChange = useCallback((language: string) => {
		dispatch(setLanguage(language))
	}, [dispatch])

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.general)}
			</h2>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.generalOverlay)}
				</h3>
				<CheckBox
					id='autoHide'
					checked={autoHide !== false}
					onCheckedChange={handleAutoHide}
				>
					{intl.formatMessage(DialogMessages.generalAutoHide)}
				</CheckBox>
			</section>

			<section className='Form-group'>
				<h4>
					{intl.formatMessage(DialogMessages.generalShowOverlayOn)}
				</h4>
				<CheckBox
					id='quotaMet'
					checked={notifyOnQuotaMet === true}
					onCheckedChange={handleNotifyOnQuotaMet}
				>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnQuotaMet)}
				</CheckBox>

				<CheckBox
					id='waveFinished'
					checked={notifyOnWaveFinished !== false}
					onCheckedChange={handleNotifyOnWaveFinished}
				>
					{intl.formatMessage(DialogMessages.generalShowOverlayOnWaveFinished)}
				</CheckBox>
			</section>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.generalLanguage)}
				</h3>
				<LanguageSelector
					language={language}
					onLanguageChange={handleLanguageChange}
				/>
			</section>
		</>
	)
}

export default GeneralPage
