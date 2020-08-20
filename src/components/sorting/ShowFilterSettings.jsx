import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'

const ShowFilterSettings = ({ labels, settings }) => {

	const [settingsToShow, setSettingsToShow] = useState([])

	useEffect(() => {
		if (settings) {
			const currentFilterSettings = []
			for (let [key, value] of Object.entries(settings)) {
				const label = labels.find(item => item.field === key).label
				if (typeof value === 'boolean') {
					value = value ? 'Так' : 'Ні'
				}
				currentFilterSettings.push({ key, label, value })
			}
			setSettingsToShow([ ...currentFilterSettings ])
		}
	}, [settings, labels])

	return (
		<Col className="filter-selection-display">
			{settingsToShow.length
				? <Row className="mx-1">
					{settingsToShow.map(setting =>
						<p key={setting.key} className="p-1">
							<em className="text-muted">{setting.label}</em> <strong>{setting.value}</strong>{' '}
						</p>
					)}
				</Row>
				: <span className="text-muted">Не вибрано жодного фільтру</span>
			}
		</Col>
	)
}

const MemodShowFilterSettings = React.memo(ShowFilterSettings)

export default MemodShowFilterSettings
