import React from 'react'
import { render, cleanup } from '@testing-library/react'
import TeachersView from '../../../components/views/public/TeachersView'

afterEach(cleanup)

describe('Teachers view', () => {

	beforeEach(() => {
		const observe = jest.fn()
		window.IntersectionObserver = jest.fn(function() {
			this.observe = observe
		})
	})

	it('renders correctly', () => {
		const { getByText } = render(
			<TeachersView />
		)
		expect(getByText(/Адміністрація/i)).toBeInTheDocument()
	})
})