import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { ListGroup, Container, Row, Col } from 'react-bootstrap'
import { initializeTeachers } from '../../reducers/teachersReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { Teacher, NewTeacherForm, FilterData, SortData, ExperienceSort } from '../teachers'

const ListOfTeachers = ({ teachers, initializeTeachers, setNotification }) => {

	const [teacherList, setTeacherList] = useState([])

	useEffect(() => {
		initializeTeachers()
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
	}, [initializeTeachers, setNotification])

	useEffect(() => {
		setTeacherList(teachers)
	}, [teachers])

	const sortBy = [
		{
			fieldName: 'dateOfBirth',
			label: 'Дата нароження'
		},
		{
			fieldName: 'employmentDate',
			label: 'Дата приняття'
		}
	]

	return (
		<Container>
			<Row className="d-flex align-items-center">
				<Col xs={12} className="border1 border-warning">
					<h4 className="py-3 custom-font text-center">
						Список усіх вчителів школи.
					</h4>
				</Col>
				<Col xs={12} sm={6}>
					<FilterData
						data={teachers}
						setData={setTeacherList}
						fieldName="name"
						placeholder="Прізвище вчителя"
					/>
				</Col>
				<Col xs={12} sm={6}>
					<ExperienceSort
						data={teachers}
						setData={setTeacherList}
					/>
				</Col>
				<Col xs={12} className="py-3">
					<SortData
						data={teacherList}
						setData={setTeacherList}
						sortBy={sortBy}
					/>
				</Col>

				<Col xs={12}>
					<ListGroup>
						{teacherList.map((teacher, index) =>
							<ListGroup.Item
								className="px-0 py-1"
								key={teacher.id}
							>
								<Teacher
									teacher={teacher}
									number={index + 1}
								/>
							</ListGroup.Item>
						)}
					</ListGroup>
				</Col>
				<Col>
					<NewTeacherForm />
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		teachers: state.teachers
	}
}

const mapDispatchToProps = {
	initializeTeachers,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListOfTeachers)
