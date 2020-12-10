import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { setNotification } from '../../../reducers/notificationReducer'
import { getUsersList } from '../../../reducers/userReducer'

import LoadingIndicator from '../../common/LoadingIndicator'
import UserDetailsCard from '../../users/UserDetailsCard'
import CommonLayout from '../../CommonLayout'

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
		<CommonLayout>
			{isLoading
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					{user.superUser
						? <>
							<h4 className="custom-font text-center">Всі користувачі</h4>
							{users.map(user => <UserDetailsCard key={user.id} userData={user} />)}
						</>
						: <Redirect
							to={{
								pathname: '/school/overview',
								state: { from: location }
							}}
						/>
					}
				</>
			}
		</CommonLayout>
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
