import './styles.css'

import * as Tabs from '@radix-ui/react-tabs'
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'

import { useAppSelector } from 'app/hooks'

import ScriptMessages from '../../messages'
import { SCRIPT_WAVE_IDS, setScriptEnabled, setScriptVoice, setScriptVolume, setScriptWaveText } from '../../slicers'
import type { ScriptWaveId } from '../../models/storage'
import { speakText } from '../../utils/speech'

const ScriptEditor = () => {
	const intl = useIntl()
	const dispatch = useDispatch()

	const enabled = useAppSelector(state => state.script.enabled)
	const waves = useAppSelector(state => state.script.waves)
	const volume = useAppSelector(state => state.script.volume)
	const selectedVoice = useAppSelector(state => state.script.voice)

	const [currentWave, setCurrentWave] = useState<ScriptWaveId>(SCRIPT_WAVE_IDS[0])
	const waveTabs = useMemo(() => SCRIPT_WAVE_IDS, [])
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

	const refreshVoices = useCallback(() => {
		if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
			return
		}
		const list = window.speechSynthesis.getVoices().filter(voice => {
			const lang = voice.lang?.toLowerCase() ?? ''
			return lang.startsWith('ja')
		})
		setVoices(list)
	}, [])

	useEffect(() => {
		refreshVoices()
		if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
			return
		}
		const handler = () => refreshVoices()
		window.speechSynthesis.addEventListener('voiceschanged', handler)
		return () => window.speechSynthesis.removeEventListener('voiceschanged', handler)
	}, [refreshVoices])

	const handleToggle = useCallback((checked: boolean | 'indeterminate') => {
		dispatch(setScriptEnabled(checked === true))
	}, [dispatch])

	const handleTest = useCallback(() => {
		speakText('よみあげてすと', volume, selectedVoice)
	}, [selectedVoice, volume])

	const handleTextChange = useCallback((waveId: ScriptWaveId) => {
		return (event: ChangeEvent<HTMLTextAreaElement>) => {
			dispatch(setScriptWaveText({
				waveId,
				text: event.target.value,
			}))
		}
	}, [dispatch])

	const handleVolumeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const next = Number.parseFloat(event.target.value)
		if (!Number.isNaN(next)) {
			dispatch(setScriptVolume(next))
		}
	}, [dispatch])

	const handleVoiceChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		dispatch(setScriptVoice(value === '' ? undefined : value))
	}, [dispatch])

	return (
		<div className='ScriptEditor'>
			<header className='ScriptEditor-header'>
				<div className='ScriptEditor-heading'>
					<p className='ScriptEditor-eyebrow'>
						{intl.formatMessage(ScriptMessages.title)}
					</p>
					<h1 className='ScriptEditor-title'>
						{intl.formatMessage(ScriptMessages.editorTitle)}
					</h1>
				</div>

				<CheckBox
					id='script-editor-enabled'
					checked={enabled}
					onCheckedChange={handleToggle}
				>
					{intl.formatMessage(ScriptMessages.enable)}
				</CheckBox>
			</header>

			<div className='ScriptEditor-controls'>
				<label className='ScriptEditor-control'>
					<span className='ScriptEditor-label'>
						{intl.formatMessage(ScriptMessages.volume)}
					</span>
					<input
						type='range'
						min={0}
						max={1}
						step={0.01}
						value={volume}
						onChange={handleVolumeChange}
					/>
				</label>

				<label className='ScriptEditor-control'>
					<span className='ScriptEditor-label'>
						{intl.formatMessage(ScriptMessages.voice)}
					</span>
					<select
						className='ScriptEditor-select'
						value={selectedVoice ?? ''}
						disabled={voices.length === 0}
						onChange={handleVoiceChange}
					>
						<option value=''>
							{voices.length === 0
								? intl.formatMessage(ScriptMessages.voiceUnavailable)
								: intl.formatMessage(ScriptMessages.voiceDefault)}
						</option>
						{voices.map(voice => (
							<option key={voice.voiceURI} value={voice.voiceURI}>
								{voice.name} ({voice.lang})
							</option>
						))}
					</select>
				</label>
			</div>

			<Tabs.Root
				className='ScriptEditor-tabs'
				value={currentWave}
				onValueChange={value => setCurrentWave(value as ScriptWaveId)}
			>
				<Tabs.List className='ScriptEditor-tablist'>
					{waveTabs.map(waveId => (
						<Tabs.Trigger
							key={waveId}
							className='ScriptEditor-tab'
							value={waveId}
						>
							{intl.formatMessage(ScriptMessages.waveTab, {
								wave: waveId.replace('Wave', ''),
							})}
						</Tabs.Trigger>
					))}
				</Tabs.List>

				{waveTabs.map(waveId => (
					<Tabs.Content
						key={waveId}
						className='ScriptEditor-content'
						value={waveId}
					>
						<textarea
							className='ScriptEditor-textarea'
							value={waves[waveId] ?? ''}
							placeholder=''
							disabled={!enabled}
							onChange={handleTextChange(waveId)}
						/>
					</Tabs.Content>
				))}
			</Tabs.Root>

			<p className='ScriptEditor-footnote'>
				{intl.formatMessage(ScriptMessages.autoSave)}
			</p>

			<div className='ScriptEditor-test'>
				<button
					type='button'
					className='Button'
					onClick={handleTest}
				>
					{intl.formatMessage(ScriptMessages.test)}
				</button>
			</div>
		</div>
	)
}

export default ScriptEditor
