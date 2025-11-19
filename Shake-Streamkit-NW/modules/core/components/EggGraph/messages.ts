import { defineMessages } from 'react-intl'

const EggGraphMessages = defineMessages({
	wave: {
		id: 'EggGraph.wave',
		defaultMessage: 'Wave <big>{wave}</big>',
	},
	extraWave: {
		id: 'EggGraph.extraWave',
		defaultMessage: 'XTRAWAVE',
	},
	quota: {
		id: 'EggGraph.quota',
		defaultMessage: 'Quota',
	},
	quotaFormat: {
		id: 'EggGraph.quotaFormat',
		defaultMessage: '{amount}/{quota}',
	},
	clear: {
		id: 'EggGraph.clear',
		defaultMessage: ' ✓',
		description: 'game cleared',
	},
	fail: {
		id: 'EggGraph.fail',
		defaultMessage: ' ✘',
		description: 'game failed',
	},
})

export default EggGraphMessages
