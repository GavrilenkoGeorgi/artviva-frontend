import React from 'react'

import CommonLayout from '../../CommonLayout'
import SpecialtiesList from '../../specialties/SpecialtiesList'
import { Helmet } from 'react-helmet'

const Specialties = () => {
	return <>
		<Helmet>
			<title>Фахови предмети школи</title>
			<meta name="description" content="Фахови предмети школи містецтв «АРТ ВІВА»." />
		</Helmet>
		<CommonLayout>
			<SpecialtiesList />
		</CommonLayout>
	</>

}

export default Specialties
