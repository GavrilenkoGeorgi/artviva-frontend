import React from 'react'
import { connect } from 'react-redux'
import { closeNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

import { Alert } from 'react-bootstrap'

/**
 * Set notification
 * @param {Object} notification Includes message and type
 */

const Notification = ({ notification, closeNotification }) => {

	return (
		<>
			{(notification.message &&
				<Alert
					className="m-5 fixed-top notification"
					variant={notification.variant}
					dismissible
					onClose={() => closeNotification()}
				>
					{notification.message}
				</Alert>
			)}
		</>
	)
}

Notification.propTypes = {
	notification: PropTypes.object.isRequired,
	closeNotification: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		notification: state.notification
	}
}

const mapDispatchToProps = {
	closeNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notification)
