import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import classes from './Announcement.module.sass'

const Announcement = () => {
	return <Col xs={12} className={classes.container}>
		<section className='p-2 p-md-4'>
			<h2 className="custom-font mt-3 mt-md-4">ШКОЛА МИСТЕЦТВ «АРТ ВІВА»<br /> ОГОЛОШУЄ НАБІР УЧНІВ</h2>
			<h3 className="custom-font-small">на 2020-2021 навчальний рік</h3>
			<article>
				{/* Announcement */}
				<Container>
					<Row>
						<Col xs={12} md={6}>
							<h4>Віком від 4 до 5 років</h4>
							<p>
								Група загального розвитку (логіка, математика, розвиток мовлення, читання,
								образотворче мистецтво, ознайомлення з навколишнім середовищем).
							</p>
						</Col>
						<Col>
							<h4>Віком від 5 до 10 років</h4>
							<p className="lead">На відділи:</p>
							<ul>
								<li>♫ Фортепіанний</li>
								<li>♫ Народні інструменти (акордеон, баян, гітара скрипка, бандура, віолончель)</li>
								<li>♫ Саксофон, флейта, ударні інструменти</li>
								<li>♫ Сольний спів</li>
								<li>♫ Естрадний спів</li>
								<li>♫ Хореографія, циркове мистецтво, бойовий гопак</li>
								<li>♫ Образотворче мистецтво</li>
								<li>♫ Театральне мистецтво</li>
							</ul>
						</Col>
					</Row>
				</Container>
			</article>
			<article>
				{/* Schedule */}
				<Container>
					<Row>
						<Col xs={12}><p className={`lead ${classes.highlighted}`}>Вступні іспити відбудуться:</p></Col>
						<Col xs={12} md={6}>
							<p>
							♫ <strong>07 червня 12:00</strong><br />
							Акордеон, баян, гітара скрипка, флейта, віолончель, саксофон, бандура, ударні інструменти.
							</p>
							<p>
								<i>Приміщення ШМ «АРТ ВІВА» с. Шпитьки, Господарська 3.</i>
							</p>
						</Col>
						<Col xs={12} md={6}>
							<p>
								♫ <strong>08 червня 12:00</strong><br />
								Хореографія, циркове мистецтво.<br />
								<i>Приміщення Будинку культури с. Шпитьки, Покровська 8.</i>
							</p>
							<p>
								Фортепіано, Народний та естрадний спів.< br />
								<i>Приміщення ШМ «АРТ ВІВА» с. Шпитьки, Господарська 3.</i>
							</p>
						</Col>
					</Row>
				</Container>
				{/* Requirements */}
				<Container className="mt-4">
					<Row>
						<Col xs={12} md={6}>
							<p className={`lead ${classes.highlighted}`}>
								Вимоги до вступних іспитів:
							</p>
							<ul className={classes.styledList}>
								<li>Музичний інструмент, співи – виконати один куплет та приспів української пісні</li>
								<li>Театральне мистецтво – продекламувати вірш</li>
								<li>Хореографія, циркове мистецтво – рухи під ритмічну музику</li>
								<li>Образотворче мистецтво – малюнок на вільну тему</li>
							</ul>
						</Col>
						<Col xs={12} md={6}>
							<p className={`lead ${classes.highlighted}`}>
								Необхідні документи для навчання:
							</p>
							<ul className={classes.styledList}>
								<li>Заява</li>
								<li>Копія свідоцтва про народження</li>
								<li>Медичну довідку про стан здоров&apos;я</li>
							</ul>
						</Col>
						<Col className="text-right p-3">
							<Link to="/apply" className={classes.CTALink}>Подати заяву</Link>
						</Col>
					</Row>
				</Container>
			</article>
		</section>
	</Col>
}

export default Announcement
