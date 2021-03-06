import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

// eslint-disable-next-line
const TogglerWithIcon = React.forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false)

	const hideWhenVisible = { display: visible ? 'none' : '', width: '100%' }
	const showWhenVisible = { display: visible ? '' : 'none', width: '100%' }

	const toggleVisibility = () => {
		setVisible(!visible)
	}

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility
		}
	})

	return (
		<>
			<Row className="d-flex justify-content-center">
				<Col>
					<div style={hideWhenVisible} className="my-2">
						<Button
							variant="outline-success"
							onClick={toggleVisibility}
							data-cy={props.dataCy}
							className="fixed-wdth-btn"
						>
							<FontAwesomeIcon icon={faEdit} />
						</Button>
					</div>
				</Col>
			</Row>
			<div style={showWhenVisible} className="px-3 pb-3">
				<Row className="d-flex justify-content-center">
					{props.children}
					<Col>
						<Button
							block
							onClick={toggleVisibility}
							type="button"
							variant="secondary"
							data-cy="toggle-btn"
						>
							Скасувати
						</Button>
					</Col>
				</Row>
			</div>
		</>
	)
})

TogglerWithIcon.propTypes = {
	buttonLabel: PropTypes.string.isRequired
}

export default TogglerWithIcon
