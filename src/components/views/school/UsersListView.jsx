import React, { useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { setNotification, setFetchingData } from '../../../reducers/notificationReducer'
import { getUsersList } from '../../../reducers/userReducer'

import UserDetailsCard from '../../users/UserDetailsCard'
import CommonLayout from '../../CommonLayout'

import UserDataContext from '../../../context/UserDataContext'

const UsersListView = ({
	users,
	setFetchingData,
	getUsersList }) => {

	const location = useLocation()
	const userData = useContext(UserDataContext)

	useEffect(() => {
		if (userData) {
			setFetchingData(true) //?
			getUsersList()
			setFetchingData(false) //?
		}
	}, [userData, getUsersList, setFetchingData])

	return userData && <>
		<Helmet>
			<title>Список користувачів</title>
			<meta name="description" content="Список користувачів."/>
		</Helmet>
		<CommonLayout>
			{userData.superUser
				? <>
					<h4 className="custom-font text-center">
						Всі користувачі
					</h4>
					{users && users.map(user =>
						<UserDetailsCard
							key={user.id}
							userData={user}
						/>
					)}
				</>
				: <Redirect
					to={{
						pathname: '/school/overview',
						state: { from: location }
					}}
				/>
			}
		</CommonLayout>
	</>
}

const mapStateToProps = state => {
	return {
		users: state.users,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setFetchingData,
	setNotification,
	getUsersList
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListView)
