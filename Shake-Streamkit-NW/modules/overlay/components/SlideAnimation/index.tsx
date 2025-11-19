import type { PropsWithChildren, Ref } from 'react'
import { CSSTransition } from 'react-transition-group'

export interface SlideAnimationProps {
	nodeRef?: Ref<HTMLElement | undefined>
	rich?: boolean
	visible?: boolean
}

export const LeftSlideAnimation = ({ children, nodeRef, rich, visible }: PropsWithChildren<SlideAnimationProps>) => {
	const timeout = rich
		? { appear: 300, enter: 167, exit: 168 }
		: 168
	return (
		<CSSTransition
			nodeRef={nodeRef}
			in={visible}
			classNames='Overlay-left--slide'
			timeout={timeout}
			unmountOnExit={rich}
		>
			{children}
		</CSSTransition>
	)
}

export const RightSlideAnimation = ({ children, nodeRef, rich, visible }: PropsWithChildren<SlideAnimationProps>) => {
	const timeout = rich
		? { appear: 300, enter: 167, exit: 168 }
		: 168
	return (
		<CSSTransition
			nodeRef={nodeRef}
			in={visible}
			classNames='Overlay-right--slide'
			timeout={timeout}
			unmountOnExit={rich}
		>
			{children}
		</CSSTransition>
	)
}
