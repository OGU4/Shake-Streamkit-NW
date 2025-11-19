import { memo } from 'react'

import { Select, SelectItem } from '@/core/components/Select'
import { LANGUAGES } from '@/core/utils/language'

interface LanguageSelectorProps {
	language?: string
	onLanguageChange?(language: string): void
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
	return (
		<div className='LanguageSelector'>
			<Select
				value={language}
				placeholder='Select Language'
				onValueChange={onLanguageChange}
			>
				{LANGUAGES.map(lang => (
					<SelectItem
						key={lang.code}
						value={lang.code}
						lang={lang.code}
					>
						{lang.name}
					</SelectItem>
				))}
			</Select>
		</div>
	)
}

export default memo(LanguageSelector)
