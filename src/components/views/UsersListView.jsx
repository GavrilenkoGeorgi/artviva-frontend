import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { setNotification } from '../../reducers/notificationReducer'
import { getUsersList } from '../../reducers/userReducer'
import userService from '../../services/users'

import { Container, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import UserDetailsCard from '../users/UserDetailsCard'

const UsersListView = ({ user, users, setNotification, getUsersList }) => {

	const [isLoading, setIsLoading] = useState(true)
	const componentIsMounted = useRef(true)
	const location = useLocation()

	useEffect(() => {
		return () => {
			componentIsMounted.current = false
		}
	}, [])

	useEffect(() => {
		if (user) {
			userService.setToken(user.token)
			getUsersList()
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (componentIsMounted.current) setIsLoading(false)
				})
		}
	}, [user, getUsersList, setNotification])

	return (
		<Container>
			<Row className="py-3 justify-content-center">
				<Col sm={10} lg={8}>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							{user.superUser
								? <>{users.map(user => <UserDetailsCard key={user.id} userData={user} />)}</>
								: <Redirect
									to={{
										pathname: '/school/overview',
										state: { from: location }
									}}
								/>
							}
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		users: state.users
	}
}

const mapDispatchToProps = {
	setNotification,
	getUsersList
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListView)
