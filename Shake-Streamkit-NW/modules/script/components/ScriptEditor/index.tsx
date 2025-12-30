import './styles.css'

import * as Tabs from '@radix-ui/react-tabs'
import { useCallback, useMemo, useState, type ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'

import { useAppSelector } from 'app/hooks'

import ScriptMessages from '../../messages'
import { SCRIPT_WAVE_IDS, setScriptEnabled, setScriptWaveText } from '../../slicers'
import type { ScriptWaveId } from '../../models/storage'

const ScriptEditor = () => {
	const intl = useIntl()
	const dispatch = useDispatch()

	const enabled = useAppSelector(state => state.script.enabled)
	const waves = useAppSelector(state => state.script.waves)

	const [currentWave, setCurrentWave] = useState<ScriptWaveId>(SCRIPT_WAVE_IDS[0])
	const waveTabs = useMemo(() => SCRIPT_WAVE_IDS, [])

	const handleToggle = useCallback((checked: boolean | 'indeterminate') => {
		dispatch(setScriptEnabled(checked === true))
	}, [dispatch])

	const handleTextChange = useCallback((waveId: ScriptWaveId) => {
		return (event: ChangeEvent<HTMLTextAreaElement>) => {
			dispatch(setScriptWaveText({
				waveId,
				text: event.target.value,
			}))
		}
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
		</div>
	)
}

export default ScriptEditor
