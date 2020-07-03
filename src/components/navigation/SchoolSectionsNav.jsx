import React, { useState, useEffect } from 'react'

import { Container, Row } from 'react-bootstrap'
import SectionLink from './SectionLink'

const SchoolSectionsNav = ({ userData }) => {

	const [links, setLinks] = useState(null)

	const superUserLinks = [
		{
			to: '/school/overview',
			label: 'Статистика'
		},
		{
			to: '/school/classes',
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
		},
		{
			to: '/school/users',
			label: 'Користувачі'
		},
		{
			to: `/school/users/${userData.id}`,
			label: 'Профіль'
		},
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

	useEffect(() => {
		userData.superUser ? setLinks(superUserLinks) : setLinks(teacherLinks)
	// eslint-disable-next-line
	}, [])

	return (
		<>
			<Container>
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
