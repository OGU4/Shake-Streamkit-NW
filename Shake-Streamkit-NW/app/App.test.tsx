import { Provider } from 'react-redux'

import { render, screen } from '@/core/utils/test'
import store from './store'

import App from './App'

// App calls useBodyClass/useAppSelector, so tests must wrap it with the real Redux store.
// Initial render should always expose the “Open Settings” trigger from SettingsWindow.

test('renders Open Settings button on initial load', () => {
	render(
		<Provider store={store}>
			<App />
		</Provider>,
	)

	const settingsButton = screen.getByRole('button', { name: /Open Settings/i })
	expect(settingsButton).toBeInTheDocument()
})

// Before: template test looked for “learn react” text that no longer exists.
// After: assert the actual “Open Settings” button renders with full provider context.
// Verification: run `npm test` and confirm App.test.tsx (and the suite) passes.
