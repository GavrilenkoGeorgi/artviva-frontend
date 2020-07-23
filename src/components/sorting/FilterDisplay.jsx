import React from 'react'

const FilterDisplay = ({ settings, currentFilter }) => {

	const rangeGauge = settings => {
		const { to, from } = settings
		if (to || from) {
			return <span className="filter-setting-value">
				Стаж {from ? `від ${from}` : null } {to ? `до ${to}` : null } років
			</span>
		} else return null
	}

	const booleanFileds = ({ isRetired, employeeIsAStudent }) => {
		if (typeof isRetired === 'boolean' || typeof employeeIsAStudent === 'boolean') {
			return <span className="filter-setting-value">
				{isRetired === false
					? 'Не на пенсії' : isRetired ? 'Пенсіонери' : null} {' '}
				{employeeIsAStudent === false
					? 'Зараз не навчаються' : employeeIsAStudent ? 'Студенти' : null }
			</span>
		} else return null
	}

	const currentFilterSelection = () => {
		switch (currentFilter) {
		case 'name':
			return <>
				<span>
					Ім&apos;я: {settings.name}
				</span>
			</>
		default: {
			const { from, to, isRetired, employeeIsAStudent, ...data } = settings
			return <>
				<span>
					{booleanFileds({ isRetired, employeeIsAStudent })}
					{rangeGauge({ to, from })}
					{Object.keys(data).map(key =>
						<span key={key}>
							{data[key]
								? <span className="filter-setting-value">
									<em>{data[key]}</em>
								</span>
								: null}
						</span>
					)}
				</span>
			</>
		}}
	}

	return (
		<p className="filter-selection-display">
			{currentFilterSelection()}
		</p>
	)
}

const MemodFilterDisplay = React.memo(FilterDisplay)

export default MemodFilterDisplay