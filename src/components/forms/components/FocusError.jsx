import { useEffect } from 'react'
import { useFormikContext } from 'formik'
import PropTypes from 'prop-types'

const FocusError = ({ formId }) => {
	// Get the context for the Formik form this component is rendered into.
	const { isSubmitting, isValidating, errors } = useFormikContext()

	useEffect(() => {
		// Get all keys of the error messages
		const keys = Object.keys(errors)

		// Whenever there are errors and the form is submitting but finished validating
		if (keys.length > 0 && isSubmitting && !isValidating) {
			const inputs = document.getElementById(formId)

			if (inputs) {
				const input = inputs[keys[0]]

				const scrollToError = inputEl => {
					try {
						const pos = inputEl.style.position
						const top = inputEl.style.top
						inputEl.style.position = 'relative'
						inputEl.style.top = '-3.5rem'
						inputEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
						inputEl.style.top = top
						inputEl.style.position = pos
						return true
					} catch (error) {
						console.error('Sorry, element to scroll to is not found.')
						return false
					}
				}

				const scrollAndFocus = input => {
					scrollToError(input)
					setTimeout(() => {
						input.focus()
					}, 1500)
				}
				if (input) scrollAndFocus(input)
			}
		}
	}, [isSubmitting, isValidating, errors, formId])

	return null
}

FocusError.propTypes = {
	formId: PropTypes.string.isRequired
}

export default FocusError
