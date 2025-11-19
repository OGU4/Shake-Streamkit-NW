import { ChangeEvent, FocusEvent, memo, useEffect, useRef } from 'react'
import { FormatNumberOptions, useIntl } from 'react-intl'

interface SliderBoxProps {
	readonly disabled?: boolean
	readonly max?: number
	readonly min?: number
	readonly step?: number
	readonly value?: number
	readonly unit?: string
	onValueChange?(value: number): void
}

const fullwidthNumber = /[．０-９]/

function normalizeNumber(value: string): number {
	let temp = ''
	for (const c of value) {
		if (c.match(fullwidthNumber)) {
			temp += String.fromCharCode(c.charCodeAt(0) - 0xFF0E + 0x2E)
		} else if (c === ',' || c === '，') {
			temp += '.'
		} else if (c === '－' || c === 'ー') {
			temp += '-'
		} else {
			temp += c
		}
	}

	const num = Number(temp)
	return num
}

const SliderBox = (props: SliderBoxProps) => {
	const {
		disabled,
		max,
		min,
		step,
		value,
		unit,
		onValueChange,
	} = props
	const intl = useIntl()
	const ref = useRef<HTMLInputElement>(null)

	const repeatFraction = step ? -Math.floor(Math.log10(step)) : 0
	const pattern = repeatFraction >= 0
		? `[\\-－ー]?[\\d０-９]+(?:[\\.．,，][\\d０-９]{0,${repeatFraction}})?`
		: '[\\-－ー]?[\\d０-９]+'

	const opts: FormatNumberOptions | undefined = repeatFraction > 0
		? { minimumFractionDigits: repeatFraction }
		: undefined

	const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.valueAsNumber
		onValueChange?.call(this, value)
	}
	const handleTextChange = (event: FocusEvent<HTMLInputElement>) => {
		if (onValueChange) {
			let value = normalizeNumber(event.target.value)
			if (Number.isNaN(value)) {
				return
			}
			if (min && value < min) {
				value = min
			}
			if (max && value > max) {
				value = max
			}
			onValueChange.call(this, value)

			// Rollback
			if (ref.current) {
				ref.current.value = intl.formatNumber(value, opts)
			}
		}
	}

	useEffect(() => {
		if (value && ref.current) {
			ref.current.value = intl.formatNumber(value, opts)
		}
	}, [value])

	return (
		<div className='InputFlex InputFlex-nofit-corner'>
			<input
				type='range'
				className='Slider'
				disabled={disabled}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={handleRangeChange}
				style={{ flexGrow: 1 }}
			/>
			<input
				ref={ref}
				type='text'
				className='TextBox'
				defaultValue={value}
				disabled={disabled}
				inputMode='numeric'
				pattern={pattern}
				onBlur={handleTextChange}
				style={{ textAlign: 'right', width: '60px' }}
			/>
			{unit && (
				<span className='InputFlex-appendix-plain-narrow'>
					{unit}
				</span>
			)}
		</div>
	)
}

export default memo(SliderBox)
