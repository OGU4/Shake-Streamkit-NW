import './style.css'

import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import type { RootState } from 'app/store'

export interface CameraPreviewProps {
	cameraId?: string
}

export const CameraPreview = function ({ cameraId }: CameraPreviewProps) {
	const refVideo = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (cameraId) {
			const constraint: MediaStreamConstraints = {
				video: {
					aspectRatio: 16 / 9,
					deviceId: cameraId,
					frameRate: 30,
				},
			}
			navigator.mediaDevices.getUserMedia(constraint).then(stream => {
				if (refVideo.current) {
					refVideo.current.srcObject = stream
				}
			})
		} else if (refVideo.current) {
			refVideo.current.srcObject = null
		}
	}, [cameraId])

	return (
		<video
			ref={refVideo}
			autoPlay
			className='CameraPreview'
			playsInline
		/>
	)
}

function mapStateToProps(state: RootState): CameraPreviewProps {
	const cameraId = state.config.cameraId
	if (cameraId) {
		return {
			cameraId,
		}
	}

	return {}
}

export default connect(mapStateToProps)(CameraPreview)
