import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { Container, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const SchoolExplained = ({ user }) => {

	const [userData, setUserData] = useState({})

	useEffect(() => {
		user ? setUserData({ id: user.id, superUser: user.superUser }) : setUserData({})
	}, [user])

	return <>
		<Helmet>
			<title>Загальна інформація про про шкільний додаток</title>
			<meta
				name="description"
				content="Загальна інформація про шкільний додаток і його роботу."
			/>
		</Helmet>
		<Container>
			<Row className="d-flex justify-content-center">
				<Col md={9}>
					<Row>
						<Col xs={12}>
							<h3 className="pb-2 pt-3 text-center custom-font">Школа для початківців</h3>
						</Col>
						<Col xs={12} className="px-3 school-explained-section">
							<p className="paragraph-text-info">
								За допомогою посилань вгорі ви можете переглянути детальну інформацію про вашу школу.
							</p>
							<p>
								Інформація, яка присутня &mdash; це
								список {userData.superUser ? <><Link to="school/teachers">вчителів</Link>, </> : null}
								<Link to="school/groups">груп</Link>,{' '}
								<Link to="school/pupils">учнів</Link> та <Link to="school/teacher/payments">виплат</Link>.
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
								Щоб змінити пароль, <Link to={`school/users/${userData.id}`}>перейдіть до свого профілю</Link>.
							</p>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	</>
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect (
	mapStateToProps,
)(SchoolExplained)
