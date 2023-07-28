import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import TeacherCard from '../../../components/teachers/TeacherCard'
import teacher from '../../../__mocks__/testTeacher'

afterEach(cleanup)

describe('Teacher card component', () => {
	let teacherCard = undefined

	beforeEach(() => {
		const observe = jest.fn()
		window.IntersectionObserver = jest.fn(function() {
			this.observe = observe
		})

		teacherCard = render(
			<TeacherCard
				person={teacher}
			/>
		)
	})

	it('renders correctly', () => {
		expect(teacherCard.getByText(/викладач фортепіано, музично-теоретичних дисциплін, концертмейстер/i)).toBeInTheDocument()
	})

	it('expands and shows additional content', () => {
		fireEvent.click(teacherCard.getByText('ще...'))
		expect(teacherCard.getByText(/Some additional test text/i)).toBeInTheDocument()
		expect(teacherCard.getByText(/Yet some more text for the second paragraph/i)).toBeInTheDocument()
	})

	it('hides expanded content after clicking a button', () => {
		// it's hidden by default, so we expand it
		fireEvent.click(teacherCard.getByText('ще...'))
		expect(teacherCard.getByText(/Some additional test text/i)).toBeVisible()

		// expanded 'more info' button is now an arrow, hence the test id
		fireEvent.click(teacherCard.getByTestId('moreInfoBtn'))
		setTimeout(() => { // is going to break if animation length would change
			expect(teacherCard.getByText(/Some additional test text/i)).not.toBeVisible()
		}, 500)
	})
})
