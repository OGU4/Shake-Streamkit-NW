import { memo, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Select, SelectItem } from '@/core/components/Select'

import { useAppSelector } from 'app/hooks'

import DialogMessages from '../messages'
import { setCameraId } from '../slicers'

const BLACKLIST_CAMERAS = [
	'Blackmagic WDM Capture',
	'Decklink Video Capture',
]

const getCameras = (callback: (cameras: readonly MediaDeviceInfo[]) => void) => {
	navigator.mediaDevices.enumerateDevices().then(devices => {
		const cameras = devices.filter(device => device.kind === 'videoinput' && !BLACKLIST_CAMERAS.includes(device.label))
		callback(cameras)
	})
}

const useCameraList = () => {
	const [cameras, setCameras] = useState<readonly MediaDeviceInfo[]>([])

	useEffect(() => {
		if (location.protocol !== 'https:') {
			return () => {}
		}

		const updateCameras = async () => {
			const result = await navigator.permissions.query({ name: 'camera' } as any)
			switch (result.state) {
			case 'granted': {
				getCameras(setCameras)
				break
			}
			case 'prompt': {
				const handlePermission = () => {
					result.removeEventListener('change', handlePermission)
					if (result.state === 'granted') {
						getCameras(setCameras)
					}
				}
				result.addEventListener('change', handlePermission)
				await navigator.mediaDevices.getUserMedia({ video: true })
				break
			}
			}
		}
		updateCameras()

		navigator.mediaDevices.addEventListener('devicechange', updateCameras)
		return () => navigator.mediaDevices.removeEventListener('devicechange', updateCameras)
	}, [])

	return cameras
}

const CameraSelector = () => {
	const cameraId = useAppSelector(state => state.config.cameraId)
	const cameras = useCameraList()

	const dispatch = useDispatch()
	const handleSelectCameraId = (cameraId: string | undefined) => {
		if (cameraId === 'none') {
			cameraId = undefined
		}
		dispatch(setCameraId(cameraId))
	}

	useEffect(() => {
		if (cameras.length !== 0 && cameraId && !cameras.find(c => c.deviceId == cameraId)) {
			dispatch(setCameraId(undefined))
		}
	}, [cameraId])

	return (
		<div className='CameraSelector'>
			<Select
				disabled={cameras.length === 0}
				value={cameras.length === 0 ? 'none' : cameraId ?? 'none'}
				placeholder='Select Camera'
				onValueChange={handleSelectCameraId}
			>
				<SelectItem value='none'>
					<FormattedMessage {...DialogMessages.developmentNone} />
				</SelectItem>
				{cameras.map(camera => (
					<SelectItem key={camera.deviceId} value={camera.deviceId}>
						{camera.label}
					</SelectItem>
				))}
			</Select>
		</div>
	)
}

export default memo(CameraSelector)
