import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Modal, Form, Button, Container, Row } from 'react-bootstrap'
import BtnWithSpinner from './buttons/BtnWithSpinner'

const EntityDeleteModal = ({
	handleDelete,
	valuetoconfirm,
	subject,
	subjectid,
	loadingState,
	...props }) => {

	const [valueChange, setValueChange] = useState('')
	const [deleteBtnState, setDeleteBtnState] = useState(true)

	const handleChange = event => (
		setValueChange(event.target.value)
	)

	useEffect(() => {
		if (valueChange === valuetoconfirm) {
			setDeleteBtnState(false)
		} else setDeleteBtnState(true)
	},[valueChange, valuetoconfirm])

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="entity-delete-modal"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="entity-delete-modal">
					Видалити {subject}?
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4 className="text-muted">{valuetoconfirm}</h4>
				<p>
					Введіть <em><strong>{valuetoconfirm}</strong></em> нижче, щоб підтвердити видалення.
				</p>
				<Form.Group>
					<Form.Control
						size="sm"
						type="text"
						autoComplete="off"
						onChange={handleChange}
					/>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Container>
					<Row className="d-flex justify-content-end">
						<Button
							onClick={props.onHide}
							block
							className="default-width-btn"
						>
							Скасуваті
						</Button>
						<BtnWithSpinner
							onClick={() => handleDelete(subjectid)}
							type="button"
							loadingState={loadingState}
							disabled={deleteBtnState}
							label="Видалити"
							variant="danger"
							dataCy="delete-entity-btn"
							className="ml-2 default-width-btn"
						/>
					</Row>
				</Container>
			</Modal.Footer>
		</Modal>
	)
}

EntityDeleteModal.propTypes = {
	handleDelete: PropTypes.func.isRequired,
	valuetoconfirm: PropTypes.string.isRequired,
	subject: PropTypes.string.isRequired,
	subjectid: PropTypes.string.isRequired
}

export default EntityDeleteModal
