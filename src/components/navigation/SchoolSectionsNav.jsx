import React, { useState, useEffect, useCallback } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { Container, Row, Col } from 'react-bootstrap'
import SectionLink from './SectionLink'
import Emoji from '../common/Emoji'
import SchoolExplained from '../help/SchoolExplained'

const SchoolSectionsNav = ({ userData }) => {

	const [links, setLinks] = useState(null)

	const Home = ({ children }) => {
		let history = useHistory()
		return history.location.pathname === '/school' ? <> {children} </> : null
	}

	const superUserLinks = [
		{
			to: `/school/users/${userData.id}`,
			label: 'Профіль'
		},
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
			label: 'Вчителі'
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
			to: `/school/users/${userData.id}`,
			label: 'Профіль'
		},
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

	const chooseLinks = useCallback(superUser => {
		superUser ? setLinks(superUserLinks) : setLinks(teacherLinks)
	}, [superUserLinks, teacherLinks])

	useEffect(() => {
		chooseLinks(userData.superUser)
	// eslint-disable-next-line
	}, [])

	return (
		<>
			<Container className="pb-2">
				<Row className="px-4 pt-sm-5 d-flex align-items-center">
					<Col xs={12} sm={5} className="text-right profile-user-name">
						<Link to="/school">
							<span className="profile-user-name">
								{userData.name} {userData.lastname}
							</span>
						</Link>
					</Col>
					{userData.superUser
						? <Col xs={12} sm={2} className="px-0 text-center">
							<Emoji label="Shield" emoji={'🛡️'} />
						</Col>
						: null
					}
					<Col xs={12} sm={5} className="text-left text-muted">
						<small className="text-small">{userData.email}</small>
					</Col>
				</Row>
				<Row className="py-3 d-flex justify-content-center">
					{links
						? links.map(link =>
							<SectionLink
								key={link.label}
								className="px-3 pt-1 school-nav-link"
								to={link.to}
								label={link.label}
							/>)
						: null
					}
				</Row>
			</Container>
			<Home>
				<SchoolExplained />
			</Home>
		</>
	)
}

export default SchoolSectionsNav
