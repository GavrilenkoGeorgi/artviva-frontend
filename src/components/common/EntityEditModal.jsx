import React from 'react'
import { Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

const EntityEditModal = (props) => {

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="entity-edit-modal"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="entity-edit-modal">
					{props.subject}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.children}
			</Modal.Body>
		</Modal>
	)
}

EntityEditModal.propTypes = {
	subject: PropTypes.string.isRequired,
	subjectid: PropTypes.string //??
}

export default EntityEditModal
