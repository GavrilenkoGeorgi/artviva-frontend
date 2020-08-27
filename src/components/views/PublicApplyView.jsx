import React from 'react'

import { Container, Col } from 'react-bootstrap'
import PupilForm from '../forms/PupilForm'
import PublicApplyStatus from '../pupils/PublicApplyStatus'
import CommonLayout from './CommonLayout'

const PublicApplyView = ({ match }) => {
	return (
		<CommonLayout>
			{match.params.status
				? <PublicApplyStatus status={match.params.status}/>
				: <>
					<h4 className="mt-3 mb-4 text-center custom-font">Подати заяву на навчання</h4>
					<Container className="px-0 mb-5 d-flex justify-content-center">
						<Col lg={8}>
							<PupilForm mode="public" />
						</Col>
					</Container>
				</>
			}
		</CommonLayout>
	)
}

export default PublicApplyView
