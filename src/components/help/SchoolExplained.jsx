import React, { useState, useEffect} from 'react'
import { connect } from 'react-redux'

import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SchoolExplained = ({ user }) => {

	const [userId, setUserId] = useState('')

	useEffect(() => {
		user ? setUserId(user.id) : setUserId('')
	}, [user])

	return <Container>
		<Row className="d-flex justify-content-center">
			<Col md={9}>
				<Row>
					<Col xs={12}>
						<h3 className="pb-2 pt-3 text-center custom-font">Школа для початківців</h3>
					</Col>
					<Col xs={12} className="px-3 school-explained-section">
						{/*<p className="paragraph-text-info">
							Here you can view your school. Information that is present is a list of teachers,
							groups, pupils and payments is present.
							You can view detailed information about every teacher and pupil and edit their data.
							All updates in realtime (well, almost all), and there is no need to reload the page,
							changes are applied instantly.
							To proceed you need to fill your teacher form
							and add your first pupil. Then you can create a group for your freshman.
							To change your password, go to your profile.
						</p>*/}
						<p className="paragraph-text-info">
							За допомогою посилань вгорі ви можете переглянути детальну інформацію про вашу школу.
						</p>
						<p>
							Інформація, яка присутня &mdash; це <Link to="school/teachers">список вчителів</Link>,{' '}
							<Link to="school/groups">груп</Link>,{' '}
							<Link to="school/pupils">учнів</Link> та <Link to="school/payments">виплат</Link>.
						</p>
						<p>
							Ви можете переглянути детальну інформацію про кожного вчителя та учня
							та відредагувати їх дані.
							Усі оновлення в режимі реального часу (ну, майже всі),
							і немає необхідності перезавантажувати сторінку, зміни застосовуються миттєво.
						</p>
						<p>
							Для цього вам потрібно заповнити форму вчителя і додати свого першого учня.
							Тоді ви можете <Link to="school/groups">створити групу</Link> для свого першого учня.
							Щоб змінити пароль, <Link to={`school/users/${userId}`}>перейдіть до свого профілю</Link>.
						</p>
					</Col>
				</Row>
			</Col>
		</Row>
	</Container>
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect (
	mapStateToProps,
)(SchoolExplained)
