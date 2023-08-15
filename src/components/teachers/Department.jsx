import React, { useState, useEffect } from 'react'
import { Container, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import LazyLoadedImage from '../common/LazyLoadedImage'
import TeacherCard from './TeacherCard'
import PropTypes from 'prop-types'
import { useScroll, useWindowSize } from '../../hooks'

import styles from './Department.module.sass'

const Department = ({ name, teachers, scrollTo }) => {

	const [open, setOpen] = useState(false)
	const [executeScroll, htmlElRef] = useScroll()

	// to show more avatars on wide screens
	const screenWidth = useWindowSize().width
	const [previews, setPreviews] = useState([])

	useEffect(() => {
		setPreviews(teachers.slice(0, 3))
		if (screenWidth >= 700) {
			setPreviews(teachers.slice(0, 7))
		}
	}, [ screenWidth, teachers])

	useEffect(() => {
		if (scrollTo === name) {
			setOpen(true)
			setTimeout(() => {
				executeScroll()
			}, 250)
		}
	}, [executeScroll, name, scrollTo])

	return (
		<Container ref={htmlElRef} className={`p-0 ${styles.departmentContainer}`}>
			<Button
				block
				onClick={() => setOpen(!open)}
				aria-controls="department-collapse"
				aria-expanded={open}
				variant="link"
				className={`sticky-top bg-white d-flex justify-content-between align-items-center ${styles.listBtn}`}
			>
				<h5 className={styles.departmentTitle}>
					{name}
				</h5>
				<div className={`${styles.previewsCont} ${open && styles.muted}`}>
					{previews.map(person =>
						<LazyLoadedImage
							key={person.id}
							src={`/img/teachers/${person.image}`}
							alt={`Фото ${person.name}`}
						/>
					)}
				</div>
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
