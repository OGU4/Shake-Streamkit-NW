import { defineMessages } from 'react-intl'

const DialogMessages = defineMessages({
	settings: {
		id: 'Dialog.settings',
		defaultMessage: 'Settings',
	},
	settingsDescription: {
		id: 'Dialog.settingsDescription',
		defaultMessage: 'You can change the overlay settings and load past data.',
	},
	openSettings: {
		id: 'Dialog.openSettings',
		defaultMessage: 'Open Settings',
	},

	about: {
		id: 'Dialog.about',
		defaultMessage: 'About App',
	},
	aboutLicense: {
		id: 'Dialog.about.license',
		defaultMessage: 'GPLv3 License',
	},
	aboutVersion: {
		id: 'Dialog.about.version',
		defaultMessage: 'Version {version}',
	},

	advanced: {
		id: 'Dialog.advanced',
		defaultMessage: 'Advanced',
	},
	advancedDisplayDuration: {
		id: 'Dialog.advanced.displayDuration',
		defaultMessage: 'Display Duration for Overlay',
	},
	advancedDisplayDurationUnit: {
		id: 'Dialog.advanced.displayDurationUnit',
		defaultMessage: 'sec',
	},
	advancedOtherOptions: {
		id: 'Dialog.advanced.otherOptions',
		defaultMessage: 'Other Options',
	},
	advancedReduceAnimations: {
		id: 'Dialog.advanced.reduceAnimations',
		defaultMessage: 'Reduce Animations',
	},
	advancedColorLock: {
		id: 'Dialog.advanced.colorLock',
		defaultMessage: 'Color Lock',
	},
	advancedWaveAnnounce: {
		id: 'Dialog.advanced.waveAnnounce',
		defaultMessage: 'Wave開始アナウンス',
	},
	advancedOomonAlert: {
		id: 'Dialog.advanced.oomonAlert',
		defaultMessage: 'オオモノ湧きアラート',
	},
	advancedPlayerStatus: {
		id: 'Dialog.advanced.playerStatus',
		defaultMessage: 'Show Player Status',
	},
	advancedLastSpawnAlert: {
		id: 'Dialog.advanced.lastSpawnAlert',
		defaultMessage: 'ラス湧き報告',
	},
	advancedJoeAlert: {
		id: 'Dialog.advanced.joeAlert',
		defaultMessage: 'ジョー警報',
	},

	dataSource: {
		id: 'Dialog.dataSource',
		defaultMessage: 'Data Source',
	},
	dataSourceServerAddress: {
		id: 'Dialog.dataSource.serverAddress',
		defaultMessage: 'Server Address',
	},
	dataSourceSave: {
		id: 'Dialog.dataSource.save',
		defaultMessage: 'Save',
	},
	dataSourceConnected: {
		id: 'Dialog.dataSource.connected',
		defaultMessage: 'Connected to {url}',
	},
	dataSourceNotConnected: {
		id: 'Dialog.dataSource.notConnected',
		defaultMessage: 'Not Connected',
	},
	dataSourceFileInput: {
		id: 'Dialog.dataSource.fileInput',
		defaultMessage: 'File Input',
	},
	dataSourcePlaybackOptions: {
		id: 'Dialog.dataSource.playbackOptions',
		defaultMessage: 'Playback Options',
	},
	dataSourceSimulationPlayback: {
		id: 'Dialog.dataSource.simulationPlayback',
		defaultMessage: 'File Input',
	},
	dataSourceSimulationSpeedUnit: {
		id: 'Dialog.dataSource.simulationSpeedUnit',
		defaultMessage: 'x',
	},

	development: {
		id: 'Dialog.development',
		defaultMessage: 'Development',
	},
	developmentPreview: {
		id: 'Dialog.development.preview',
		defaultMessage: 'Preview',
	},
	developmentUseCamera: {
		id: 'Dialog.development.useCameraAsBackground',
		defaultMessage: 'Use camera as background',
	},
	developmentNone: {
		id: 'Dialog.development.none',
		defaultMessage: 'None',
	},
	developmentNotification: {
		id: 'Dialog.development.notification',
		defaultMessage: 'Notification',
	},
	developmentTestNotifications: {
		id: 'Dialog.development.testNotifications',
		defaultMessage: 'Test Notifications',
	},
	developmentEnvironment: {
		id: 'Dialog.development.environment',
		defaultMessage: 'Environment',
	},
	developmentBroadcastMode: {
		id: 'Dialog.development.broadcastMode',
		defaultMessage: 'Broadcast Mode: {status}',
	},
	developmentBroadcastModeDisabled: {
		id: 'Dialog.development.broadcastMode.disabled',
		defaultMessage: 'Disabled',
		description: 'broadcast software: disabled',
	},
	developmentBroadcastModeEnabled: {
		id: 'Dialog.development.broadcastMode.enabled',
		defaultMessage: 'Enabled',
		description: 'broadcast software: enabled',
	},
	developmentBroadcastSoftware: {
		id: 'Dialog.development.broadcastSoftware',
		defaultMessage: 'Broadcast Software: {software}',
	},

	log: {
		id: 'Dialog.log',
		defaultMessage: 'Log',
	},
	logNologs: {
		id: 'Dialog.noLogs',
		defaultMessage: 'No Logs',
	},

	general: {
		id: 'Dialog.general',
		defaultMessage: 'General',
	},
	generalOverlay: {
		id: 'Dialog.general.overlay',
		defaultMessage: 'Overlay',
	},
	generalAutoHide: {
		id: 'Dialog.general.autoHide',
		defaultMessage: 'Hide overlay automatically',
	},
	generalShowOverlayOn: {
		id: 'Dialog.general.showOverlayOn',
		defaultMessage: 'Show Overlay on:',
	},
	generalShowOverlayOnQuotaMet: {
		id: 'Dialog.general.showOverlayOn.quotaMet',
		defaultMessage: 'Quota Met',
	},
	generalShowOverlayOnWaveFinished: {
		id: 'Dialog.general.showOverlayOn.waveFinished',
		defaultMessage: 'Wave Finished',
	},
	generalLanguage: {
		id: 'Dialog.general.language',
		defaultMessage: 'Language',
	},
})

export default DialogMessages
