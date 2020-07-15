import React from 'react'
import { connect } from 'react-redux'
import { initializePupils, initialiseUserPupils } from '../../reducers/pupilsReducer'

import PupilsList from '../pupils/PupilsList'

const PupilsView = ({ user, initializePupils, initialiseUserPupils }) => {
	return (
		<>
			{user && user.superUser
				? <>
					<h4 className="custom-font text-center">Всі учні школи</h4>
					<PupilsList getPupils={initializePupils} />
				</>
				: <>
					<h4 className="custom-font text-center">Ваши учні</h4>
					<PupilsList getPupils={initialiseUserPupils} />
				</>
			}
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	initializePupils,
	initialiseUserPupils
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilsView)
