import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'

import { Row, Col, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap'
import NavBarLink from './NavBarLink'
import NavTogglerIcon from '../common/NavTogglerIcon'
import Logout from '../common/Logout'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import styles from './NavigationBar.module.sass'

const NavigationBar = ({ user }) => {

	// navbar visibility and hiding on scroll
	const [visibility, setVisibility] = useState(true)
	const [prevScrollpos, setScrollPosition] = useState(window.pageYOffset)

	const handleScroll = useCallback(() => {
		const currentScrollPos = window.pageYOffset
		const visible = prevScrollpos > currentScrollPos

		setVisibility(visible)
		setScrollPosition(currentScrollPos)
	}, [prevScrollpos])

	useEffect(() => {
		document.addEventListener('scroll', handleScroll)
		return () => document.removeEventListener('scroll', handleScroll)
	}, [handleScroll])

	// closing on click outside
	const navBarRef = useRef(null)
	const [isExpanded, setExpanded] = useState(false)

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside, false)
		return () => document.removeEventListener('mousedown', handleClickOutside, false)
	},[])

	const toggleExpanded = () => {
		setExpanded(!isExpanded)
	}

	const handleClickOutside = event => {
		if (navBarRef.current.contains(event.target)) {
			return
		}
		setExpanded(false)
	}

	// list of links
	const linkClassList = 'main-nav-link'

	const navLinks = [
		{
			to: '/teachers',
			label: 'Вчителі',
			className: linkClassList
		},
		{
			to: '/showcase',
			label: 'На сцені',
			className: linkClassList
		},
		{
			to: '/about',
			label: 'Історія',
			className: linkClassList
		},
		{
			to: '/blog',
			label: 'Новини',
			className: linkClassList
		},
		{
			to: '/contacts',
			label: 'Контакти',
			className: linkClassList
		}
	]

	return (
		<header>
			<Navbar
				ref={navBarRef}
				fixed="top"
				collapseOnSelect
				onToggle={toggleExpanded}
				expanded={isExpanded}
				expand="lg"
				bg="light"
				variant="light"
				data-cy="navbar"
				className={`${styles.navbar} ${visibility ? 'navbar-visible' : 'navbar-hidden'}`}
			>
				<Navbar.Brand href="/" className="p-0 d-flex align-items-center">
					<Image
						alt="Лого"
						src="/img/logo/artviva_logo_small.png"
						className="nav-logo-img"
					/>{' '}
					<Row className="d-inline pl-2 nav-logo">
						<Col xs={12} className="pl-3 nav-logo-font">
							ArtViva
						</Col>
						<Col xs={12} className="pl-3 nav-logo-small-font">
							школа мистецтв
						</Col>
					</Row>
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls="responsive-navbar-nav"
					data-cy="navbar-toggle"
				>
					<NavTogglerIcon type={isExpanded}/>
				</Navbar.Toggle>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<NavDropdown
							title="Школа"
							id="school-mgmt-links"
							className="school-mgmt-links"
						>
							<NavDropdown.Item href="/apply">Подати заяву</NavDropdown.Item>
							<NavDropdown.Item href="/legaldocs">Нормативна база</NavDropdown.Item>
							<NavDropdown.Item href="/pay/form">Оплата навчання</NavDropdown.Item>
							<NavDropdown.Item href="/prices">Ціни</NavDropdown.Item>
							{user
								? <>
									<NavDropdown.Divider />
									<NavDropdown.Item href="/school">
										Вчительська
									</NavDropdown.Item>
									<NavDropdown.Item href={`/school/users/${user.id}`}>
										<span className="nav-list-icon">
											<FontAwesomeIcon icon={faUser} />
										</span>
										<em>Профіль {user.lastname}</em>
									</NavDropdown.Item>
									<NavDropdown.Item href="#">
										<Logout />
									</NavDropdown.Item>
								</>
								: <>
									<NavDropdown.Item href="/register">Реєстрація</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item
										data-cy="navbar-login-link"
										href="/login"
										className="text-right"
									>
											Вхід
									</NavDropdown.Item>
								</>
							}
						</NavDropdown>
						{navLinks.map(link =>
							<NavBarLink
								key={link.to}
								to={link.to}
								className={link.className}
								href={link.to}
								label={link.label}
								onClick={toggleExpanded}
							/>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</header>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(NavigationBar)
