import './App.css'

import { useBodyClass } from '@/core/hooks/bodyclass'
import NotificationController from '@/notification/components/NotificationController'
import OverlayController from '@/overlay/components/OverlayController'
import OverlayHost from '@/overlay/components/OverlayHost'
import SettingsWindow from '@/settings'

const App = () => {
	useBodyClass()

	return (
		<>
			<OverlayHost />

			<NotificationController />

			<div className='App-ui'>
				<SettingsWindow />
				<OverlayController />
			</div>
		</>
	)
}

export default App
