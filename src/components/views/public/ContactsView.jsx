import React from 'react'
import ContactMap from '../../common/ContactMap'
import departmentsData from '../../../data/departments.json'
import { Container, Row } from 'react-bootstrap'
import DepartmentCard from '../../common/DepartmentCard'

const ContactsView = () => {

	const { departments } = departmentsData
	const mapStyles = {
		height: '70vh',
		width: '100%',
		top: '4rem'
	}

	const initialCenter = {
		lat: 50.454760,
		lng: 30.143868
	}

	const largePaddingTop = {
		// that map of google's is somehow absolutely positioned
		paddingTop: '75vh'
	}

	return (
		<>
			<ContactMap
				mapStyles={mapStyles}
				initialCenter={initialCenter}
				zoom={11}
				departments={departments}
			/>
			<h1 className="text-center py-2 custom-font">Філії</h1>
			<Container style={largePaddingTop}>
				<Row className="d-flex justify-content-around px-2">
					{departments.map(department =>
						<DepartmentCard
							key={department.id}
							department={department}
						/>
					)}
				</Row>
			</Container>
		</>
	)
}

export default ContactsView
