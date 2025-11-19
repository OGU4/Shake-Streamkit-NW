import { forwardRef } from 'react'

import { CheckIcon } from '@heroicons/react/16/solid'
import * as SelectPrimitive from '@radix-ui/react-select'

const SelectItem = forwardRef<HTMLDivElement, SelectPrimitive.SelectItemProps>(function SelectItem({ children, ...props }, forwardedRef) {
	return (
		<SelectPrimitive.Item
			className='SelectItem'
			ref={forwardedRef}
			{...props}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator className='SelectItem-icon'>
				<CheckIcon />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	)
})

export default SelectItem
