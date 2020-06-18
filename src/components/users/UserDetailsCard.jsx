import React, { useState, Suspense } from 'react'

import { Card } from 'react-bootstrap'
import Emoji from '../common/Emoji'
import EntityControlButtons from '../common/EntityControlButtons'
import LoadingIndicator from '../common/LoadingIndicator'
import UserEditForm from '../forms/UserEditForm'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const UserDetailsCard = ({ userData }) => {

	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = () => {
		console.log('Deleting')
		setIsDeleting(true)

		setTimeout(() => {
			setIsDeleting(false)
			console.log('Deleted')
			setDeleteModalShow(false)
		}, 1000)
	}

	return (
		<>
			<Card className="mb-2" border={userData.superUser ? 'warning' : null}>
				<Card.Header as="h6">
					{userData.name} {userData.middlename} {userData.lastname}
				</Card.Header>
				<Card.Body className="pb-1">
					<Card.Text>
						<Emoji label="E-Mail" emoji={'📧'} /> <a href={`mailto:${userData.email}`}>{userData.email}</a>
					</Card.Text>
					<Card.Text>
						{userData.superUser
							? <>
								<Emoji label="Key" emoji={'🔑'} />
								Користувач &mdash; адміністратор сайту
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
						userData={userData}
					/>
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="користувача"
					subjectid={userData.id}
					valuetoconfirm={userData.name}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
			</Suspense>
		</>
	)
}

export default UserDetailsCard
