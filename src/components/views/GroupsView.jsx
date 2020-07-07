import React from 'react'
import { connect } from 'react-redux'
import { initializeSchoolClasses } from '../../reducers/schoolClassesReducer'

import SchoolClassesList from '../schoolClasses/SchoolClassesList'

const GroupsView = ({ initializeSchoolClasses }) => {
	return (
		<>
			<h4 className="text-center">Всі групи школи</h4>
			<SchoolClassesList getGroups={initializeSchoolClasses}/>
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	initializeSchoolClasses
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupsView)
