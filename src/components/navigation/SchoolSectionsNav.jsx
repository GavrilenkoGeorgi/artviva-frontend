import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Container, Row, Col } from 'react-bootstrap'
import SectionLink from './SectionLink'
import Emoji from '../common/Emoji'

const SchoolSectionsNav = ({ user }) => {

	const [links, setLinks] = useState([])
	const superUserLinks = [
		{
			to: '/school/users',
			label: 'Користувачі'
		},
		{
			to: '/school/overview',
			label: 'Статистика'
		},
		{
			to: '/school/groups',
			label: 'Групи'
		},
		{
			to: '/school/teachers',
			label: 'Вчителі',
			dataCy: 'teachers-section'
		},
		{
			to: '/school/pupils',
			label: 'Учні'
		},
		{
			to: '/school/specialties',
			label: 'Спеціальності'
		},
		/*{
			to: '/school/branches',
			label: 'Філії'
		},*/
		{
			to: '/school/payments',
			label: 'Платежі'
		}
	]

	const teacherLinks = [
		{
			to: '/school/groups',
			label: 'Групи'
		},
		{
			to: '/school/pupils',
			label: 'Учні'
		},
		{
			to: '/school/teacher/payments',
			label: 'Платежи'
		},
	]

	useEffect(() => {
		if (user)
			user.superUser
				? setLinks(superUserLinks)
				: setLinks(teacherLinks)
		// eslint-disable-next-line
	}, [user])

	// don't school nav inside public routes
	const path = /\/(school+)/
	if (!window.location.pathname.match(path)) return null

	return <>
		{user && <Container className="pt-5">
			<Row className="px-4 pt-sm-5 d-flex align-items-center">
				<Col xs={12} sm={5} className="text-right profile-user-name">
					<Link to="/school">
						<span className="profile-user-name">
							{user.name} {user.lastname}
						</span>
					</Link>
				</Col>
				{user.superUser
					? <Col xs={12} sm={2} className="px-0 text-center">
						<Emoji label="Shield" emoji={'🛡️'} />
					</Col>
					: null
				}
				<Col xs={12} sm={5} className="text-left text-muted">
					<small className="text-small">{user.email}</small>
				</Col>
			</Row>
			<Row className="py-3 d-flex justify-content-center">
				{/* User profile link */}
				<SectionLink
					dataCy="user-profile-link"
					className="px-3 pt-1 school-nav-link"
					to={`/school/users/${user.id}`}
					label="Профіль"
				/>
				{/* User type links */}
				{links.map(link =>
					<SectionLink
						key={link.label}
						dataCy={link.dataCy}
						className="px-3 pt-1 school-nav-link"
						to={link.to}
						label={link.label}
					/>
				)}
			</Row>
		</Container>
		}
	</>
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(SchoolSectionsNav)
