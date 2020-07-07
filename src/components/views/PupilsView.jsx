import React from 'react'
import { connect } from 'react-redux'
import { initializePupils } from '../../reducers/pupilsReducer'

import PupilsList from '../pupils/PupilsList'

const PupilsView = ({ initializePupils }) => {
	return (
		<>
			<h4 className="text-center">Учні вчителя</h4>
			<PupilsList getPupils={initializePupils} />
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	initializePupils
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilsView)
