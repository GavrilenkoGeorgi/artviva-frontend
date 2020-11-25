import React from 'react'
import { connect } from 'react-redux'
import { initialiseUserPupils } from '../../../reducers/pupilsReducer'

import PupilsList from '../../pupils/PupilsList'

const TeacherPupilsView = ({ initialiseUserPupils }) => {
	return (
		<>
			<h4 className="custom-font text-center">Учні вчителя</h4>
			<PupilsList getPupils={initialiseUserPupils} />
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	initialiseUserPupils
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherPupilsView)
