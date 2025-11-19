import { defineMessages } from 'react-intl'

const OverlayMessages = defineMessages({
	connected: {
		id: 'overlay.connected',
		defaultMessage: 'Connected',
	},
	notConnected: {
		id: 'overlay.notConnected',
		defaultMessage: 'Not Connected',
	},
	noData: {
		id: 'overlay.noData',
		defaultMessage: 'No Data',
	},
	hideOverlay: {
		id: 'overlay.hideOverlay',
		defaultMessage: 'Hide Overlay',
	},
	showOverlay: {
		id: 'overlay.showOverlay',
		defaultMessage: 'Show Overlay',
	},
	showOverlayWithWave: {
		id: 'overlay.showOverlayWithWave',
		defaultMessage: 'Show Wave {wave}',
	},
})

export default OverlayMessages
