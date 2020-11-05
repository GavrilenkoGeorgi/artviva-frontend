import React from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Col } from 'react-bootstrap'
import BtnWithIcon from './buttons/BtnWithIcon'

const EntityControlButtons = ({
	route,
	openEditModal,
	openDeleteModal,
	processingForm,
	entity
}) => {

	const history = useHistory()

	const routeChange = () => {
		history.push(route)
	}

	return (
		<Col className="my-2 d-flex justify-content-end align-items-center">
			{history.location.pathname !== route
				? <BtnWithIcon
					dataCy={`show-info-${entity}`}
					label="Детальніше"
					icon="info"
					variant="outline-primary"
					type="button"
					onClick={routeChange}
				/>
				: <BtnWithIcon
					dataCy={`delete-${entity}`}
					label="Видалити"
					icon="trash"
					variant="outline-danger"
					type="button"
					onClick={() => openDeleteModal()}
				/>
			}
			<BtnWithIcon
				dataCy={`edit-${entity}`}
				label="Редагувати"
				icon="edit"
				variant="outline-success"
				type="button"
				loading={processingForm}
				onClick={() => openEditModal()}
			/>
		</Col>
	)
}

const mapStateToProps = (state) => {
	return {
		processingForm: state.notification.processingForm
	}
}

EntityControlButtons.propTypes = {
	route: PropTypes.string,
	openEditModal: PropTypes.func.isRequired,
	openDeleteModal: PropTypes.func
}

export default connect(
	mapStateToProps
)(EntityControlButtons)
