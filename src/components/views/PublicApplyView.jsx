import React from 'react'

import PupilForm from '../forms/PupilForm'
import PublicApplyStatus from '../pupils/PublicApplyStatus'
import { Container, Row, Col } from 'react-bootstrap'

const PublicApplyView = ({ match }) => {
	return (
		<Container>
			<Row className="justify-content-center">
				<Col sm={10} lg={6}>
					{match.params.status
						? <PublicApplyStatus status={match.params.status}/>
						: <>
							<h4 className="text-center">Подати заяву на навчання</h4>
							<PupilForm mode="public" />
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

export default PublicApplyView
