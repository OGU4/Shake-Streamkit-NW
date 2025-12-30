import './styles.css'

import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import CheckBox from '@/core/components/CheckBox'

import { useAppSelector } from 'app/hooks'

import ScriptMessages from '../../messages'
import { setScriptEnabled } from '../../slicers'
import { getScriptEditorUrl } from '../../utils/url'

const ScriptPanel = () => {
	const intl = useIntl()
	const dispatch = useDispatch()
	const enabled = useAppSelector(state => state.script.enabled)

	const editorUrl = useMemo(() => getScriptEditorUrl(), [])

	const handleToggle = useCallback((checked: boolean | 'indeterminate') => {
		dispatch(setScriptEnabled(checked === true))
	}, [dispatch])

	const handleEdit = useCallback(() => {
		const ref = window.open(editorUrl, 'script-editor')
		ref?.focus?.()
	}, [editorUrl])

	return (
		<section className='ScriptPanel'>
			<div className='ScriptPanel-header'>
				<span className='ScriptPanel-title'>
					{intl.formatMessage(ScriptMessages.title)}
				</span>
				<button
					type='button'
					className='Button'
					disabled={!enabled}
					onClick={handleEdit}
				>
					{intl.formatMessage(ScriptMessages.edit)}
				</button>
			</div>

			<CheckBox
				id='script-enabled'
				checked={enabled}
				onCheckedChange={handleToggle}
			>
				{intl.formatMessage(ScriptMessages.enable)}
			</CheckBox>
		</section>
	)
}

export default ScriptPanel
