import React from 'react'

import PupilForm from '../forms/PupilForm'
import PublicApplyStatus from '../pupils/PublicApplyStatus'
import CommonLayout from './CommonLayout'

const PublicApplyView = ({ match }) => {
	return (
		<CommonLayout>
			{match.params.status
				? <PublicApplyStatus status={match.params.status}/>
				: <>
					<h4 className="pt-4 text-center">Подати заяву на навчання</h4>
					<PupilForm mode="public" />
				</>
			}
		</CommonLayout>
	)
}

export default PublicApplyView
