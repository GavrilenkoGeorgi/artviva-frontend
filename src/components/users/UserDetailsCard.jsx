import React, { useState, Suspense, useRef } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import { deleteUser } from '../../reducers/userReducer'
import { setNotification,	setProcessingForm } from '../../reducers/notificationReducer'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Link, useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import Emoji from '../common/Emoji'
import EntityControlButtons from '../common/EntityControlButtons'
import LoadingIndicator from '../common/LoadingIndicator'
import UserEditForm from '../forms/UserEditForm'
import { useEffect } from 'react'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const UserDetailsCard = ({
	userData,
	user,
	mode,
	processingForm,
	deleteUser,
	setNotification,
	setProcessingForm }) => {

	const unmounted = useRef(false)
	const history = useHistory()
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [deleteSuccessful, setDeleteSuccessful] = useState(false)

	useEffect(() => {
		if (deleteSuccessful) history.push('/school/users')
	}, [deleteSuccessful, history])

	const handleDelete = () => {
		setProcessingForm(true)
		userService.setToken(user.token)
		deleteUser(userData.id)
			.then(() => {
				setDeleteSuccessful(true)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) {
					setDeleteModalShow(false)
					setProcessingForm(false)
				}
			})
	}

	return (
		<Container className="">
			<Row className="user-details-card py-4">
				<Col xs={12} className={`user-details-email ${userData.superUser ? 'user-details-highlight' : ''}`}>
					{userData.superUser
						?	<Emoji label="Shield" emoji={'🛡️'}/>
						: null
					}
					<span>{userData.email}</span>
				</Col>
				<Col xs={12} sm={4} className="user-detail-name">
					{userData.name} {userData.middlename} {userData.lastname}
				</Col>
				<Col xs={12} sm={8}>
					<Row className="user-details-info">
						{userData.superUser
							? <Col xs={12} className="user-state-detail">
								<Emoji label="Key" emoji={'🔑'} />
								Користувач &mdash; завуч
							</Col>
							: null
						}

						<Col xs={12} className="user-state-detail">
							{userData.isActive
								? <>
									<Emoji label="Check Mark" emoji={'✔️'} />
									Обліковий запис активовано
								</>
								: <>
									<Emoji label="Cross Mark" emoji={'❌'} />
									<span className="text-warning">Обліковий не запис активовано</span>
								</>
							}
						</Col>

						<Col xs={12} className="user-state-detail">
							{userData.approvedUser
								? <>
									<Emoji label="Check Mark" emoji={'✔️'} />
									Користувача схвалено адміністрацією.
								</>
								: <>
									<Emoji label="Cross Mark" emoji={'❌'} />
									<span className="text-warning">Користувача не схвалено адміністрацією.</span>
								</>
							}
						</Col>

						<Col xs={12}>
							<p>
								<em>
									Ім&apos;я в анкеті:{' '}
								</em>
								{userData.teacher ? userData.teacher.name : 'ще не заповнив'}
							</p>
						</Col>

						<Col xs={12}>
							<em>Групи:</em> {userData.teacher && userData.teacher.schoolClasses
								? <span>{userData.teacher.schoolClasses.map(group => (
									<p key={group.id}>
										{group.specialty.title} &mdash;{' '}
										<Link to={`/school/groups/${group.id}`}>
											{group.title}
										</Link>
									</p>
								))}
								</span>
								: 'ще не має жодної'}
						</Col>

						{userData.createdAt
							? <Col xs={12} className="user-card-timestap">
								<em>Зареєструвався:</em> {' '}
								{moment(userData.createdAt).format('LL')}
							</Col>
							: null
						}
						{userData.updatedAt
							? <Col xs={12} className="user-card-timestap">
								<em>Останнє оновлення профілю:</em> {' '}
								{moment(userData.createdAt).format('LL')}
							</Col>
							: null
						}
						<Col xs={12}>
							<EntityControlButtons
								route={`/school/users/${userData.id}`}
								openEditModal={() => setEditModalShow(true)}
								openDeleteModal={() => setDeleteModalShow(true)}
							/>
						</Col>

					</Row>
				</Col>
			</Row>

			{/* User edit and delete modal */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="користувача"
					subjectid={userData.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<UserEditForm
						closeModal={() => setEditModalShow(false)}
						mode={mode}
						userData={userData}
					/>
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="користувача"
					subjectid={userData.id}
					valuetoconfirm={userData.name}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={processingForm}
					onHide={() => setDeleteModalShow(false)}
				/>
			</Suspense>
		</Container>
	)
}

UserDetailsCard.propTypes = {
	userData: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	user: state.user,
	processingForm: state.notification.processingForm
})

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	deleteUser
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserDetailsCard)
