import React, { useState } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react'
import PropTypes from 'prop-types'

const ContactMap = ({
	google,
	zoom,
	mapStyles,
	initialCenter,
	departments }) => {

	const [showingInfoWindow, setShowingInfoWindow] = useState(false)
	const [activeMarker, setActiveMarker] = useState({})
	const [selectedPlace, setSelectedPlace] = useState({})

	const onMarkerClick = (props, marker) => {
		setSelectedPlace(props)
		setActiveMarker(marker)
		setShowingInfoWindow(true)
	}

	const onClose = () => {
		if (showingInfoWindow) {
			setActiveMarker(null)
			setShowingInfoWindow(false)
		}
	}

	return (
		<Map
			google={google}
			zoom={zoom}
			style={mapStyles}
			initialCenter={initialCenter}
		>
			{departments.map(department => (
				<Marker
					onClick={onMarkerClick}
					position={{ lat: department.latitude, lng: department.longitude }}
					key={department.id}
					id={department.id}
					name={department.name}
					address={department.address}
					phone={department.phone}
				/>
			))}
			<InfoWindow
				marker={activeMarker}
				visible={showingInfoWindow}
				onClose={onClose}
			>
				<div className="marker-info">
					<ul>
						<li>
							<strong>{selectedPlace.name}</strong>
						</li>
						<li>
							{selectedPlace.address}
						</li>
						<li>
							{selectedPlace.phone}
						</li>
						<li>
							<a href={`#${selectedPlace.id}`}>
								докладніше...
							</a>
						</li>
					</ul>
				</div>
			</InfoWindow>
		</Map>
	)
}

ContactMap.propTypes = {
	google: PropTypes.object.isRequired,
	zoom: PropTypes.number.isRequired,
	mapStyles: PropTypes.object.isRequired,
	initialCenter: PropTypes.object.isRequired,
	departments: PropTypes.array.isRequired
}

export default GoogleApiWrapper({
	// eslint-disable-next-line
	apiKey: process.env.REACT_APP_MAPS_API_KEY
})(ContactMap)
