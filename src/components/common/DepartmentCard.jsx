import React from 'react'
import { Container, Row, Col, Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSchool, faUsers, faInfo, faPhone, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

const DepartmentCard = ({ department }) => {

	const iconStyle = 'department-icon fa-sm mr-2'
	const infoRowStyle = 'py-2'
	const infoColumnStyle = 'd-flex justify-content-center align-items-center'

	return (
		<Col xs={12} lg={6}>
			<Card
				id={department.id}
				bg="light"
				className="mb-4 default-shadow"
			>
				<Card.Header>
					<FontAwesomeIcon icon={faSchool} className={iconStyle} />
					{department.town}
				</Card.Header>
				<Card.Body>
					<Card.Title>
						{department.name}
					</Card.Title>
					{department.image
						? <Image
							src={`img/departments/${department.image}`}
							fluid
							rounded
							thumbnail
						/>
						: null
					}
					<Container>
						{department.info
							? <Row className={infoRowStyle} >
								<Col xs={1} className={infoColumnStyle}>
									<FontAwesomeIcon icon={faInfo} />
								</Col>
								<Col>
									<Card.Text>
										{department.info}
									</Card.Text>
								</Col>
							</Row>
							: null
						}
						<Row className={infoRowStyle} >
							<Col xs={1} className={infoColumnStyle}>
								<FontAwesomeIcon icon={faUsers} />
							</Col>
							<Col>
								<Card.Text>
									<Link to={`/teachers/${department.town}`}>
										Вчителі філії
									</Link>
								</Card.Text>
							</Col>
						</Row>
						{department.phone
							? <Row className={infoRowStyle} >
								<Col xs={1} className={infoColumnStyle}>
									<FontAwesomeIcon icon={faPhone} />
								</Col>
								<Col>
									<Card.Text>
										{department.phone}
									</Card.Text>
								</Col>
							</Row>
							: null
						}
						<Row className={infoRowStyle}>
							<Col xs={1} className={infoColumnStyle}>
								<FontAwesomeIcon icon={faMapMarkedAlt} />
							</Col>
							<Col>
								<Card.Text>
									{department.address}
								</Card.Text>
							</Col>
						</Row>
					</Container>
				</Card.Body>
			</Card>
		</Col>
	)
}

DepartmentCard.propTypes = {
	department: PropTypes.object.isRequired
}

export default DepartmentCard
