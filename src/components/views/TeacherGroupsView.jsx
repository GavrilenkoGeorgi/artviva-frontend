import React from 'react'


import SchoolClassesList from '../schoolClasses/SchoolClassesList'

const TeacherGroupsView = (props) => {
	return (
		<>
			<h4 className="text-center">Групи вчителя</h4>
			<SchoolClassesList mode="single"/>
		</>
	)
}

export default TeacherGroupsView
