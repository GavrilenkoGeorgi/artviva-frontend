import React from 'react'
import { Provider } from 'react-redux'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import store from '../../../store'
import PricesView from '../../../components/views/public/PricesView'

import axiosMock from 'axios'
import mockSpecialtiesData from '../../../fixtures/specialties'

describe('<PricesView /> component', () => {

	beforeEach(async () => {
		axiosMock.get.mockResolvedValue({ data: mockSpecialtiesData })

		await waitFor(() => {
			render(
				<Provider store={store}>
					<PricesView />
				</Provider>
			)
		})
	})

	it('renders correctly with default tab open', () => {
		expect(screen.getByText('Інформація про освітні послуги'))
			.toBeInTheDocument()

		const priceListTab = screen.getByRole('tab', { name: 'Ціни' })
		expect(priceListTab).toHaveAttribute('aria-selected', 'true')
	})

	it('shows prices list', () => {
		expect(screen.getByText('Basic programming language')).toBeInTheDocument()
		expect(screen.getByText('350.35')).toBeInTheDocument()
	})

	it('opens benefits tab on click', async () => {
		const benefitsTab = screen.getByRole('tab', { name: 'Пільги' })

		expect(benefitsTab).toHaveAttribute('aria-selected', 'false')
		userEvent.click(benefitsTab)

		await waitFor(() => {
			expect(benefitsTab).toHaveAttribute('aria-selected', 'true')
			expect(screen.getByText(/В нашій школі надаються/)).toBeInTheDocument()
		})
	})

	it('opens schooling conditions tab on click', async () => {
		const conditionsTab = screen.getByRole('tab', { name: 'Умови навчання' })

		expect(conditionsTab).toHaveAttribute('aria-selected', 'false')
		userEvent.click(conditionsTab)

		await waitFor(() => {
			expect(conditionsTab).toHaveAttribute('aria-selected', 'true')
			expect(screen.getByText(/Заняття проводяться індивідуально/)).toBeInTheDocument()
		})
	})
})
