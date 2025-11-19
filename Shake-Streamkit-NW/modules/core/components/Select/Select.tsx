import { FC } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'
import * as SelectPrimitive from '@radix-ui/react-select'

interface ShakeSelectProps {
	placeholder: string
}

const Select: FC<ShakeSelectProps & SelectPrimitive.SelectProps> = ({ children, placeholder, ...props }) => {
	return (
		<SelectPrimitive.Root {...props}>
			<SelectPrimitive.Trigger className='Select'>
				<SelectPrimitive.Value placeholder={placeholder} />
				<SelectPrimitive.Icon className='Select-icon'>
					<ChevronDownIcon />
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Content className='Select-content'>
					<SelectPrimitive.ScrollUpButton className='Select-button'>
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpButton>

					<SelectPrimitive.Viewport className='Select-viewport'>
						{children}
					</SelectPrimitive.Viewport>

					<SelectPrimitive.ScrollDownButton className='Select-button'>
						<ChevronDownIcon />
					</SelectPrimitive.ScrollDownButton>
				</SelectPrimitive.Content>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	)
}

export default Select
