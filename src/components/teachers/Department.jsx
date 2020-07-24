import React, { useState, useEffect } from 'react'
import { Container, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import TeacherCard from './TeacherCard'
import PropTypes from 'prop-types'
import { useScroll } from '../../hooks'

const Department = ({ name, teachers, scrollTo }) => {

	const [open, setOpen] = useState(false)
	const [executeScroll, htmlElRef] = useScroll()

	useEffect(() => {
		if (scrollTo === name) {
			setOpen(true)
			setTimeout(() => {
				executeScroll()
			}, 250)
		}
	}, [executeScroll, name, scrollTo])

	return (
		<Container ref={htmlElRef} className="my121-1 px-0 border1 border-light">
			<Button
				block
				onClick={() => setOpen(!open)}
				aria-controls="department-collapse"
				aria-expanded={open}
				variant="link"
				className="d-flex justify-content-between align-items-center"
			>
				<h5>
					{name}
				</h5>
				{ open
					? <FontAwesomeIcon icon={faAngleUp} />
					: <FontAwesomeIcon icon={faAngleDown} />
				}
			</Button>
			<Collapse in={open}>
				<Container className="px-0">
					{teachers.map(teacher =>
						<TeacherCard key={teacher.id} person={teacher} />
					)}
				</Container>
			</Collapse>
		</Container>
	)
}

Department.propTypes = {
	name: PropTypes.string.isRequired,
	teachers: PropTypes.array.isRequired,
	scrollTo: PropTypes.string
}


export default Department
