import './styles.css'

import { useEnvironment } from '@/core/components/EnvironmentProvider'

import CameraPreview from '../CameraPreview'
import OverlayEggGraph from '../OverlayEggGraph'
import ProductLogo from '../ProductLogo'

const OverlayHost = () => {
	const environment = useEnvironment()
	const broadcastEnabled = environment && 'broadcast' in environment

	return (
		<div className='OverlayHost'>
			{!broadcastEnabled && (
				<CameraPreview />
			)}

			<OverlayEggGraph />
			<ProductLogo />
		</div>
	)
}

export default OverlayHost
