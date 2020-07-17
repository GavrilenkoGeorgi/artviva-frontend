import React, { useState, useEffect, useCallback } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import SectionLink from './SectionLink'
import Emoji from '../common/Emoji'

const SchoolSectionsNav = ({ userData }) => {

	const [links, setLinks] = useState(null)

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
		{
			to: '/school/branches',
			label: 'Філії'
		},
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
			to: '/school/teachergroups',
			label: 'Групи'
		},
		{
			to: '/school/teacherpupils',
			label: 'Учні'
		}
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
				<Row className="d-flex align-items-center pb-3">
					<Col className="pr-1 text-right text-muted">
						<small className="text-small">{userData.email}</small>
					</Col>
					{userData.superUser
						? <Col xs={1} className="px-0 text-center">
							<Emoji label="Shield" emoji={'🛡️'} />
						</Col>
						: null
					}
					<Col className="pl-1 align-self-center">
						<em className="profile-user-name">{userData.lastname} </em>
					</Col>
				</Row>
				<Row className="d-flex justify-content-center">
					{links
						? links.map(link =>
							<SectionLink
								key={link.label}
								className="py-2 px-3 section-link"
								to={link.to}
								label={link.label}
							/>)
						: null
					}
				</Row>
			</Container>
		</>
	)
}

export default SchoolSectionsNav
