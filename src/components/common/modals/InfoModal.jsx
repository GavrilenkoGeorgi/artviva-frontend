import React from 'react'
import PropTypes from 'prop-types'

import { Modal } from 'react-bootstrap'
import { Button } from '../buttons'

const InfoModal = ({ btnLabel, title, text, ...props }) => {
	return (
		<Modal
			{ ...props }
		>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{Object.keys(text).map(part => (
					<p
						key={part}
						className="info-modal-paragraph"
					>
						{text[part]}
					</p>
				))}
			</Modal.Body>
			<Modal.Footer>
				<Button
					// label="Я згоден"
					label={btnLabel || 'Я згоден'}
					type="button"
					dataCy="modal-agree-btn"
					block
					variant="primary"
					onClick={props.onHide}
				>
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

InfoModal.propTypes = {
	title: PropTypes.string.isRequired,
	text: PropTypes.object.isRequired,
	btnLabel: PropTypes.string
}

export default InfoModal
