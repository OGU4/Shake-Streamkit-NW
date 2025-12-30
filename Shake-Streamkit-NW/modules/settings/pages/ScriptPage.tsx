import { useIntl } from 'react-intl'

import ScriptPanel from '@/script/components/ScriptPanel'

import ScriptMessages from '@/script/messages'

const ScriptPage = () => {
	const intl = useIntl()
	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(ScriptMessages.title)}
			</h2>

			<ScriptPanel />
		</>
	)
}

export default ScriptPage
