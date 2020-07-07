import React, { useEffect, useState, Suspense, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { initializeBranches } from '../../reducers/branchesReducer'

import { Container, ListGroup } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import CollapseForm from '../common/CollapseForm'
import Branch from './Branch'

const LazyBranchForm = React.lazy(() => import('../forms/BranchForm'))

const BranchesList = ({ initializeBranches, branches }) => {

	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])


	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		initializeBranches()
			.catch(error => {
				setNotification({
					message: `Щось пішло не так, спробуйте пізніше:
						${error.status} ${error.statusText}`,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) setIsLoading(false)
			})
	// eslint-disable-next-line
	}, [])

	return (
		<Container>
			{isLoading
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					<p className="pt-3">
						Список усіх філії школи.
					</p>
					<ListGroup>
						{branches.map(branch =>
							<ListGroup.Item
								className="px-0 py-1"
								key={branch.id}
							>
								<Branch branch={branch} />
							</ListGroup.Item>
						)}
					</ListGroup>

					<p className="py-3 text-muted">
						Щоб додати відділення, вам потрібна така інформація:
						назва, місто, адреса, номер телефону.
					</p>

					<CollapseForm
						title="Додати нову філію"
						ariaControls="branch-add-form-collapse"
					>
						<Suspense
							fallback={
								<LoadingIndicator
									animation="border"
									variant="primary"
								/>}>
							<LazyBranchForm mode='create' />
						</Suspense>
					</CollapseForm>
				</>
			}
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		branches: state.branches
	}
}

const mapDispatchToProps = {
	setNotification,
	initializeBranches
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BranchesList)
