import React, { useState, Suspense } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import { deleteUser } from '../../reducers/userReducer'
import { setNotification,	setProcessingForm } from '../../reducers/notificationReducer'

import { Card } from 'react-bootstrap'
import Emoji from '../common/Emoji'
import EntityControlButtons from '../common/EntityControlButtons'
import LoadingIndicator from '../common/LoadingIndicator'
import UserEditForm from '../forms/UserEditForm'

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

	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)

	const handleDelete = () => {
		setProcessingForm(true)
		userService.setToken(user.token)
		deleteUser(userData.id)
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				setProcessingForm(false)
			})
	}

	return (
		<>
			<Card className="mb-2" border={userData.superUser ? 'warning' : null}>
				<Card.Header as="h6" className="text-secondary">
					<em>{userData.name} {userData.middlename} {userData.lastname}</em>
				</Card.Header>
				<Card.Body className="pb-1">
					<Card.Text>
						<Emoji label="E-Mail" emoji={'📧'} /> <a href={`mailto:${userData.email}`}>{userData.email}</a>
					</Card.Text>
					<Card.Text>
						{userData.superUser
							? <>
								<Emoji label="Key" emoji={'🔑'} />
								Користувач &mdash; завуч
							</>
							: null
						}
					</Card.Text>
					<Card.Text>
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
					</Card.Text>
					<Card.Text>
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
					</Card.Text>
					<EntityControlButtons
						openEditModal={() => setEditModalShow(true)}
						openDeleteModal={() => setDeleteModalShow(true)}
					/>
				</Card.Body>
			</Card>
			{/* Teacher edit and delete modal */}
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
		</>
	)
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
