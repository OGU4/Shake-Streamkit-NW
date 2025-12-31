import { defineMessages } from 'react-intl'

const ScriptMessages = defineMessages({
	title: {
		id: 'Script.title',
		defaultMessage: 'Script',
	},
	enable: {
		id: 'Script.enable',
		defaultMessage: 'Enable script feature',
	},
	edit: {
		id: 'Script.edit',
		defaultMessage: 'Edit script',
	},
	voice: {
		id: 'Script.voice',
		defaultMessage: 'Voice',
	},
	volume: {
		id: 'Script.volume',
		defaultMessage: 'Volume',
	},
	voiceUnavailable: {
		id: 'Script.voiceUnavailable',
		defaultMessage: 'No Japanese voices available in this browser.',
	},
	voiceDefault: {
		id: 'Script.voiceDefault',
		defaultMessage: 'Browser default (Japanese if available)',
	},
	test: {
		id: 'Script.test',
		defaultMessage: '読み上げテスト',
	},
	editorTitle: {
		id: 'Script.editorTitle',
		defaultMessage: 'Script editor',
	},
	autoSave: {
		id: 'Script.autoSave',
		defaultMessage: 'Changes save automatically to this browser.',
	},
	waveTab: {
		id: 'Script.waveTab',
		defaultMessage: 'Wave {wave}',
	},
})

export default ScriptMessages
