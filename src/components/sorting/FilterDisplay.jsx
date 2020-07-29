import React from 'react'

const FilterDisplay = ({ labels, settings, currentFilter }) => {

	const rangeGauge = settings => {
		const { to, from } = settings
		if (to || from) {
			return <span className="filter-setting-value">
				Стаж {from ? `від ${from}` : null } {to ? `до ${to}` : null } років
			</span>
		} else return null
	}

	const booleanFields = ({ isRetired, employeeIsAStudent }) => {
		if (typeof isRetired === 'boolean' || typeof employeeIsAStudent === 'boolean') {
			return <span className="filter-setting-value">
				{isRetired === false
					? 'Не на пенсії' : isRetired ? 'Пенсіонери' : null} {' '}
				{employeeIsAStudent === false
					? 'Зараз не навчаються' : employeeIsAStudent ? 'Студенти' : null }
			</span>
		} else return null
	}

	const benefits = data => {
		return data === 0 ? <span>Немає пільг </span> : data ? <span>Пільги: {data}% </span> : null
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
			const { from, to, isRetired, employeeIsAStudent, hasBenefit, ...data } = settings
			return <>
				<span>
					{booleanFields({ isRetired, employeeIsAStudent })}
					{rangeGauge({ to, from })}
					{benefits(hasBenefit)}
					{Object.keys(data).map(key =>
						<span key={key}>
							{data[key]
								? <span className="filter-setting-value">
									<em className="text-muted">
										{labels.find(item => item.field === key).label}
									</em>:{' '}
									<strong>{data[key]}</strong>
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