import React from 'react'
import { render, cleanup } from '@testing-library/react'
import AboutView from '../../../components/views/public/AboutView'

afterEach(cleanup)

describe('About view', () => {
	it('renders correctly', () => {
		const { getByText } = render(
			<AboutView />
		)
		expect(getByText(/музика, не згадуючи ні npo що, може сказати все/i)).toBeInTheDocument()
	})
})
