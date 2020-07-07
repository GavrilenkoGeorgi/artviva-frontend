import React from 'react'
import { connect } from 'react-redux'
import { initialiseTeacherGroups } from '../../reducers/schoolClassesReducer'

import SchoolClassesList from '../schoolClasses/SchoolClassesList'

const TeacherGroupsView = ({ initialiseTeacherGroups }) => {
	return (
		<>
			<h4 className="text-center">Групи вчителя</h4>
			<SchoolClassesList getGroups={initialiseTeacherGroups}/>
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	initialiseTeacherGroups
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherGroupsView)
