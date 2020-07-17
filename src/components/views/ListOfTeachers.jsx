import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { ListGroup, Container, Row, Col } from 'react-bootstrap'
import { initializeTeachers } from '../../reducers/teachersReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { Teacher,
	NewTeacherForm, FilterData, SortData,
	ExperienceSort, SelectData } from '../teachers'

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

	/*
	// const martialStatuses = ['Одружений', 'Не одружений']
	// const scienceDegrees = ['Немає', 'Доктор наук', 'Кандидат наук']

	const teacherBoolFields = [
		{
			fieldNames: ['employeeIsAStudent', 'isRetired'],
			fields: [
				{
					field: 'isRetired',
					label: 'Пенсионер?',
					choices: ['На пенсии', 'Не пенсионер']
				},
				{
					field: 'employeeIsAStudent',
					label: 'Студент?',
					choices: ['Зараз навчается', 'Не навчается']
				}
			]
		}
	]*/

	const teacherSelectFields = [
		{
			field: 'gender',
			label: 'Стать',
			choices: ['Чоловіча', 'Жіноча']
		},
		{
			field: 'qualification',
			label: 'Кваліфікаційна категорія',
			choices: ['Немає', 'ІІ категорія', 'І категорія', 'Вища категорія']
		},
		{
			field: 'educationType',
			label: 'Освітній рівень',
			choices: ['Повна віща освіта', 'Базова віща освіта', 'Неповна віща освіта']
		},
		{
			field: 'educationDegree',
			label: 'Освітньо-кваліфікаційний рівень',
			choices: ['Магистр', 'Спеціаліст', 'Бакалавр', 'Молодший спеціаліст']
		},
		{
			field: 'category',
			label: 'Розряд',
			choices: [9, 10, 11, 12, 13, 14, 15, 16, 17]
		},
		{
			field: 'teacherTitle',
			label: 'Педагогічне звання',
			choices: ['Немає', 'Старший викладач', 'Викладач-методист']
		},
		{
			field: 'employeeType',
			label: 'Тип співробітника',
			choices: ['Штатний співробітник', 'Сумісник']
		},
		{
			field: 'residence',
			label: 'Місцевість проживання',
			choices: ['Місто', 'Село']
		}
	]

	return (
		<Container>
			<Row className="d-flex align-items-center border1">
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
						data={teachers}
						setData={setTeacherList}
						sortBy={sortBy}
					/>
				</Col>

				{/* Filter by assorted fields */}
				<Col xs={12} className="py-3">
					<SelectData
						data={teachers}
						setData={setTeacherList}
						selectBy={teacherSelectFields}
					/>
				</Col>

				{/* Filter boolean fields

				<Col xs={12} className="py-3">
					<FilterBooleanFields
						data={teachers}
						setData={setTeacherList}
						selectBy={teacherBoolFields}
					/>
				</Col> */}

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
