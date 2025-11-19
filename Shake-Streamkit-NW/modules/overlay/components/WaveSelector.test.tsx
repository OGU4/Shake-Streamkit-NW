import userEvent from '@testing-library/user-event'

import { cleanup, render, screen } from '@/core/utils/test'
import { WaveType } from '@/core/utils/wave'

import { WaveSelector } from './WaveSelector'

const getActions = () => {
	return {
		selectWave: vi.fn((wave?: WaveType) => wave),
	}
}

describe('<WaveSelector /> render', () => {
	afterEach(() => cleanup())

	test('"wave" is undefined', async () => {
		const actions = getActions()
		const user = userEvent.setup()
		render(<WaveSelector waves={[1]} {...actions} />)

		const hideOverlayButton = screen.getByRole('button', { name: 'Hide Overlay' })
		const showWave1Button = screen.getByRole('button', { name: 'Show Wave 1' })

		// Check each state
		expect(hideOverlayButton).toBeDisabled()
		expect(showWave1Button).toBeEnabled()

		// Click "Show Wave 1"
		await user.click(showWave1Button)
		expect(actions.selectWave).toHaveReturnedWith(1)
	})

	test('"wave" is 1', async () => {
		const actions = getActions()
		const user = userEvent.setup()
		render(<WaveSelector waves={[1]} selectedWave={1} {...actions} />)

		const hideOverlayButton = screen.getByRole('button', { name: 'Hide Overlay' })
		const showWave1Button = screen.getByRole('button', { name: 'Show Wave 1' })

		// Check each state
		expect(hideOverlayButton).toBeEnabled()
		expect(showWave1Button).toBeDisabled()

		// Click "Hide Overlay"
		await user.click(hideOverlayButton)
		expect(actions.selectWave).toHaveBeenCalledOnce()
	})

	test('Display up to Wave 5', async () => {
		const actions = getActions()
		render(<WaveSelector waves={[1, 2, 3, 4, 5]} {...actions} />)

		// Check each state
		expect(screen.getByRole('button', { name: 'Hide Overlay' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Show Wave 1' })).toBeEnabled()
		expect(screen.getByRole('button', { name: 'Show Wave 2' })).toBeEnabled()
		expect(screen.getByRole('button', { name: 'Show Wave 3' })).toBeEnabled()
		expect(screen.getByRole('button', { name: 'Show Wave 4' })).toBeEnabled()
		expect(screen.getByRole('button', { name: 'Show Wave 5' })).toBeEnabled()
	})
})
