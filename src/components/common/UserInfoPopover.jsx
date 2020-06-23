import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { ListGroup, Popover, Overlay } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Logout from './Logout'

const UserInfoPopover = ({ user }) => {

	const [show, setShow] = useState(false)
	const [target, setTarget] = useState(null)
	const ref = useRef(null)

	const closePopover = () => {
		setShow(false)
	}

	const handleClick = event => {
		setShow(!show)
		setTarget(event.target)
	}
	return (
		<div ref={ref} className="px-2 d-flex justify-content-end align-items-center">
			<FontAwesomeIcon
				icon={faUser}
				onClick={handleClick}
				className="user-status-icon"
				data-cy="navbarUserIcon"
			/>
			<Overlay
				show={show}
				target={target}
				placement="bottom"
				container={ref.current}
				rootClose
				onHide={closePopover}
			>
				<Popover id="popover-basic">
					<Popover.Title as="h3">
						{user ? `Hello, ${user.name} ${user.middlename} ${user.lastname}` : 'Hello'}!
					</Popover.Title>
					<Popover.Content>
						<ListGroup variant="flush">
							{user ?
								<>
									<ListGroup.Item className="p-2">{user.email}</ListGroup.Item>
									<ListGroup.Item className="p-2">
										<Link
											to={'/profile'}
											onClick={closePopover}
										>
											Профіль
										</Link>
									</ListGroup.Item>
									<ListGroup.Item className="p-2">
										{user.id}
									</ListGroup.Item>
								</>
								: null
							}
							<ListGroup.Item className="text-center">
								{user
									? <Logout />
									: <Link to={'/login'} onClick={closePopover}>
											Логін
									</Link>
								}
							</ListGroup.Item>
						</ListGroup>
					</Popover.Content>
				</Popover>
			</Overlay>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(UserInfoPopover)
