import { useAppSelector } from 'app/hooks'

const IgnoreCurrentMatchBanner = () => {
	const ignoreCurrentMatch = useAppSelector(state => state.telemetry.ignoreCurrentMatch)

	if (!ignoreCurrentMatch) {
		return null
	}

	return (
		<div className='IgnoreCurrentMatchBanner'>
			現在のゲームは途中から接続されたため Shake-Streamkit は待機中です。次のマッチングから有効になります。
		</div>
	)
}

export default IgnoreCurrentMatchBanner
