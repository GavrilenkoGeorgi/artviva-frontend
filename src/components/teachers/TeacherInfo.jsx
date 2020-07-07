import React from 'react'
import moment from 'moment'

import { Card } from 'react-bootstrap'
import Emoji from '../common/Emoji'

const TeacherInfo = ({ teacher: teacherDetails, teacherExperience }) => {

	const cardStyle = 'mb-3'

	return (
		<>
			<h6>
				{/* eslint-disable-next-line */}
				<Emoji label="Magnifying Glass Tilted Right" emoji={'🔎'} /> Детальна інформація про вчітеля
			</h6>
			{/* Teacher info */}
			<Card className={cardStyle}>
				<Card.Body>
					<Card.Text>
						<strong>{teacherDetails.name}</strong> - {teacherDetails.employeeType}<br />
						{teacherDetails.specialties.map(specialty => (
							<span key={specialty.id}>{specialty.title}</span>
						))}
					</Card.Text>
					<Card.Text>
						Працює з: {moment(teacherDetails.employmentDate).format('LL')}
					</Card.Text>
					<Card.Text>
						{/* eslint-disable-next-line */}
						Повний стаж с урахуванням додаткового: {teacherExperience.years} років {teacherExperience.months} місяців {teacherExperience.days} днів
					</Card.Text>
					<Card.Text>
						{/* eslint-disable-next-line */}
						Додатковій стаж: {teacherDetails.experienceToDate.years} років {teacherDetails.experienceToDate.months} місяців {teacherDetails.experienceToDate.days} днів
					</Card.Text>
					<Card.Text>
						Розряд: {teacherDetails.category}
					</Card.Text>
					<Card.Text>
						{teacherDetails.isAdministration ? 'Адміністрація ' : null }
						{teacherDetails.isRetired ? 'Пенсионер ' : null }
						{teacherDetails.employeeIsAStudent ? 'Навчается у ВНЗ' : null }
					</Card.Text>
					<Card.Text>
						Кваліфікаційна категорія: {teacherDetails.qualification}
					</Card.Text>
					<Card.Text>
						Педагогічне звання: {teacherDetails.teacherTitle}
					</Card.Text>
					<Card.Text>
						Наукова ступінь: {teacherDetails.scienceDegree}
					</Card.Text>
				</Card.Body>
			</Card>

			{/* Contacts */}
			<Card className={cardStyle}>
				<Card.Body>
					<Card.Subtitle className="mb-2 text-muted">
						<Emoji label="Telephone Receiver" emoji={'📞'} /> Контактні дані
					</Card.Subtitle>
					<Card.Text>
						Електронна пошта: <a href={`mailto:${teacherDetails.contactEmail}`}>
							{teacherDetails.contactEmail}
						</a>
					</Card.Text>
					<Card.Text>
						Телефонний №: {teacherDetails.phone}
					</Card.Text>
					<Card.Text>
						{/* eslint-disable-next-line */}
						Місцевість проживання: {teacherDetails.residence === 'Місто'
							? <Emoji label="Cityscape" emoji={'🏙️'} />
							: <Emoji label="House with Garden" emoji={'🏡'} />}
							&nbsp;{teacherDetails.residence}
					</Card.Text>
				</Card.Body>
			</Card>

			{/* Personal info */}
			<Card className={cardStyle}>
				<Card.Body>
					<Card.Subtitle className="mb-2 text-muted">
						<Emoji label="Memo" emoji={'📝'} /> Персональна інформація
					</Card.Subtitle>
					<Card.Text>
						{/* eslint-disable-next-line */} {/* no gender diversity ( */}
						Стать: {teacherDetails.gender === 'Чоловіча'
							? <Emoji label="Man" emoji={'👨'} />
							: <Emoji label="Woman" emoji={'👩'} />}
							&nbsp;{teacherDetails.gender}
					</Card.Text>
					<Card.Text>
						Сімеїний стан: {teacherDetails.maritalStatus}
					</Card.Text>
				</Card.Body>
			</Card>

			{/* Education info */}
			<Card className={cardStyle}>
				<Card.Body>
					<Card.Subtitle className="mb-2 text-muted">
						<Emoji label="Graduation Cap" emoji={'🎓'} /> Освіта
					</Card.Subtitle>
					<Card.Text>
						Навчальний заклад: {teacherDetails.university}
					</Card.Text>
					<Card.Text>
						Освітній рівень: {teacherDetails.educationType}
					</Card.Text>
					<Card.Text>
						Освітньо-кваліфікаційний рівень: {teacherDetails.educationDegree}
					</Card.Text>
				</Card.Body>
			</Card>

			{/* Additinal info */}
			<Card className={cardStyle}>
				<Card.Body>
					<Card.Subtitle className="mb-2 text-muted">
						<Emoji label="Green Book" emoji={'📗'} /> Додаткова інформація
					</Card.Subtitle>
					<Card.Text>
						{teacherDetails.info || 'Немає'}
					</Card.Text>
				</Card.Body>
			</Card>
		</>
	)
}

export default TeacherInfo
