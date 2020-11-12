import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BtnWithSpinner from '../../../components/common/buttons/BtnWithSpinner'

const mockOnClick = jest.fn()

describe('<BtnWithSpinner /> component', () => {
	let view
	let button

	beforeEach(() => {
		view = render(
			<>
				<BtnWithSpinner
					type="button"
					loadingState={false}
					disabled={false}
					waitingState={false}
					label="test button"
					variant="primary"
					dataCy="test-btn"
					className="test-class"
					onClick={mockOnClick}
				/>
			</>
		)
		button = screen.getByTestId('test-btn')
	})

	it('renders correctly', () => {
		view.debug(button)
		expect(button).toHaveAttribute('type', 'button')
		expect(button).toContainHTML('test button')
		expect(button).toBeEnabled()
		expect(button).toHaveClass('test-class')
	})

	it('switches to disabled state', () => {
		const { rerender } = view

		rerender(<>
			<BtnWithSpinner
				type="button"
				loadingState={false}
				disabled={true}
				label="test button"
				variant="primary"
				dataCy="test-btn"
			/>
		</>)
		expect(button).toHaveAttribute('disabled')
	})

	it('calls onclick function', () => {
		fireEvent.click(button)
		expect(mockOnClick).toHaveBeenCalledTimes(1)
	})

	it('shows loading spinner while processing form', () => {
		const { rerender } = view

		rerender(<>
			<BtnWithSpinner
				type="button"
				loadingState={true}
				waitingState={false}
				label="test button"
				variant="primary"
				dataCy="test-btn"
			/>
		</>)
		const spinner = view.getByTestId('loading-spinner')
		expect(button).toContainElement(spinner)
		expect(button).not.toContainHTML('test button')
	})

	it('shows waiting spinner on waiting state', () => {
		const { rerender } = view

		rerender(<>
			<BtnWithSpinner
				type="button"
				loadingState={false}
				waitingState={true}
				label="test button"
				variant="primary"
				dataCy="test-btn"
			/>
		</>)
		const spinner = view.getByTestId('waiting-spinner')
		expect(button).toContainElement(spinner)
		expect(button).not.toContainHTML('test button')
	})
})
