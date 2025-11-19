import './styles.css'

import { useRef } from 'react'

import { useAppSelector } from 'app/hooks'

import { RightSlideAnimation } from '../SlideAnimation'

const ProductLogo = function () {
	const poweredby = useAppSelector(state => state.overlay.poweredby)
	const ref = useRef<HTMLDivElement>(null)
	return (
		<RightSlideAnimation nodeRef={ref} visible={poweredby}>
			<div className='Overlay Overlay-right Overlay-right--slide-exit-done ProductLogo' ref={ref}>
				<span className='ProductLogo-poweredby'>Powered By</span>
				<br />
				<span className='ProductLogo-logo'>
					Shake
					<br />
					StreamKit
				</span>
			</div>
		</RightSlideAnimation>
	)
}

export default ProductLogo
