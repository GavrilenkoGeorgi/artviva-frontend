import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import store from '../../../store'
import SpecialtiesList from '../../../components/specialties/SpecialtiesList'

import axiosMock from 'axios'
import mockSpecialtiesData from '../../../fixtures/specialties'
import { initializeSpecialties } from '../../../reducers/specialtiesReducer'


describe('<SpecialtiesList /> component', () => {
	const [ specialty ] = mockSpecialtiesData

	beforeEach(() => {
		axiosMock.get.mockResolvedValue({ data: mockSpecialtiesData })
		store.dispatch(initializeSpecialties())

		render(
			<Provider store={store}>
				<Router>
					<SpecialtiesList />
				</Router>
			</Provider>
		)
	})

	it('renders correctly', () => {
		expect(screen.getByText(/Список усіх спеціальностей школи/)).toBeInTheDocument()
		expect(screen.getByText(/Щоб створити спеціальність, вам потрібна така інформація/)).toBeInTheDocument()

		expect(screen.getByText(`1. ${specialty.title}`)).toBeInTheDocument()

		const list = screen.getByTestId('specialties-list')
		expect(list.childNodes.length).toBe(mockSpecialtiesData.length)
	})

	it('clicking on the specialty title shows additional info', async () => {
		const btn = screen.getByRole('button',
			// eslint-disable-next-line
			{ name: `1. ${specialty.title} ${specialty.teachers.length} вчителів та ${specialty.schoolClasses.length} групи` })

		userEvent.click(btn)
		expect(screen.getByText(`Вартість: ${specialty.cost} грн`)).toBeInTheDocument()
		expect(screen.getByText(`Інфо: ${specialty.info}`)).toBeInTheDocument()
	})
})
