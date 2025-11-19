import type { PropsWithChildren, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'

import { render as rtlRender } from '@testing-library/react'

function render(ui: ReactNode, { locale = 'en', ...renderOptions } = {}) {
	const Wrapper = ({ children }: PropsWithChildren) => {
		return (
			<IntlProvider locale={locale}>
				{children}
			</IntlProvider>
		)
	}
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { render }
