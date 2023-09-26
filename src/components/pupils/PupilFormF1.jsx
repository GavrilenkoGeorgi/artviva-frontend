import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import pupilsService from '../../services/pupils'
import { setNotification, setFetchingData } from '../../reducers/notificationReducer'
import moment from 'moment'

import html2pdf from 'html2pdf.js'
import { Container, Row, Col, Button } from 'react-bootstrap'

const PupilFormF1 = ({ user, match, setNotification, setFetchingData }) => {

	const componentIsMounted = useRef(true)
	const [f1Data, setF1Data] = useState({})

	useEffect(() => {
		setFetchingData(true)
		if (user) {
			pupilsService.pupilF1FormData(match.params.id)
				.then(data => {
					setF1Data(data)
				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше: ${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (componentIsMounted.current) setFetchingData(false)
				})
		}
	}, [user, match.params.id, setNotification, setFetchingData])

	const generatePdf = () => {
		var element = document.getElementById('f1-form')
		var opt = {
			margin: 0,
			filename: `${f1Data.name} Ф-1.pdf`,
			// image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
		}

		html2pdf().set(opt).from(element).save()
	}

	return <>
		<Helmet>
			<title>Форма Ф1 учня</title>
			<meta name="description" content="Форма Ф1 учня."/>
		</Helmet>
		<Container>
			<Row className="justify-content-center">
				<Col sm={8} className="my-5">
					<Button block
						variant="outline-primary"
						onClick={ () => generatePdf() }>
						Завантажити форму {`${f1Data.name} Ф-1.pdf`}
					</Button>
				</Col>
			</Row>
		</Container>
		<Container id='f1-form' className="f1-form mb-5">
			<h1 className="f1-page-title">Ф-1</h1>
			<Row className="f1-header-text">
				<Col>
					<p>
						До наказу:<br />
						__________________________________<br />
						__________________________________<br />
						__________________________________
					</p>
				</Col>
				<Col>
					<p className="text-right">
						Виконуючому обов’язки директора<br />
						«Школи мистецтв «АРТ ВІВА»<br />
						Робакідзе Лілії Вікторівні<br />
						від <span className="f1-form-field-underline">
							{f1Data.applicantName}</span><br />
						що проживає: <span className="f1-form-field-underline">
							{f1Data.homeAddress}</span><br />
					</p>
				</Col>
			</Row>

			<h3 className="f1-title">Заява</h3>
			<Row className="justify-content-end">
				<Col className="f1-apply-text">
					<p>Прошу прийняти мою дитину: <span className="f1-form-field-underline">
						{f1Data.name}
					</span><br />
						В школу за фахом: <span className="f1-form-field-underline">
						{f1Data.specialty
							? f1Data.specialty.title
							: null
						}
					</span>
					</p>
					<h4 className="f1-subheader">
						Відомості про учня
					</h4>
					<p>
						1. Призвище, ім&apos;я, по побатькові: <span className="f1-form-field-underline">
							{f1Data.name}
						</span></p>
					<p>
						2. Число, місяць, рік народження: <span className="f1-form-field-underline">
							{moment(f1Data.dateOfBirth).format('LL')}
						</span></p>
					<p>
						3. В якому закладі навчається: <span className="f1-form-field-underline">
							{f1Data.mainSchool}
						</span></p>
					<p>
						4. Клас у ЗОШ <span className="f1-form-field-underline">
							{f1Data.mainSchoolClass}
						</span></p>
					<p>
						5. ПІБ та місце роботи батька: <span className="f1-form-field-underline">
							{f1Data.fathersName}, {f1Data.fathersEmploymentInfo}
						</span></p>
					<p className="pl-3">
						№ телефону <span className="f1-form-field-underline">
							{f1Data.fathersPhone}
						</span></p>
					<p>
						6. ПІБ та місце роботи матері: <span className="f1-form-field-underline">
							{f1Data.mothersName}, {f1Data.mothersEmploymentInfo}
						</span></p>
					<p className="pl-3">
						№ телефону <span className="f1-form-field-underline">
							{f1Data.mothersPhone}
						</span></p>

					<h4 className="f1-subheader">
						До заяви додаються:
					</h4>
					<p className="f1-docs">
						1. Копія свідоцтва про народження<br/>
						2. Медична довідка про відсутність протипоказань до занять у закладі
					</p>
				</Col>
				<Col xs={12}>
					<p className="f1-personal-data-text">
						Відповідно до Закону України “Про захист персональних даних” надаю
						«Школа мистецтв «АРТ ВІВА» згоду на обробку зазначених у
						даній заяві особистих персональних даних у картотеках
						та/або за допомогою інформаційно-телекомунікаційної системи бази
						персональних даних з метою:<br />
						- ведення діловодства для реалізації визначених законодавством прав та
						обов&apos;язків учнів у навчальному процесі та платі за навчання;<br />
						- підготовки, відповідно до діючого законодавства, статистичної,
						адміністративної та іншої інформації з питань навчання.
					</p>
					<p className="f1-personal-data-text">
						Зобов&apos;язуюсь при зміні персональних даних дитини у найкоротший
						термін надати закладу уточнену інформацію та подавати оригінали відповідних
						документів для внесення нових особистих даних до бази персональних даних учнів закладу.
					</p>
				</Col>
			</Row>

			<Row>
				<Col className="f1-obligations-text">
					<h4 className="f1-subheader">
						Зобов&apos;язання
					</h4>
					<p>
						Я погоджуюсь з умовами плати за навчання та ознайомлений(а)
						з тим, що місячний розмір плати за навчання визначений в
						середньому на 9 місяців поточного навчального року, а також з тим, що у розрахунок
						включена оплата за час канікул, періодів карантинів, строки яких визначаються місцевими
						органами виконавчої влади, несприятливих погодних умов тощо та час відсутності учня на
						уроках незалежно від обставин.
					</p>
					<p>
						Мене попереджено про те, що у разі, якщо до 10 числа поточного місяця не буде внесена
						встановлена плата за навчання, викладач має право не допускати
						учня до уроків, а після 10 числа наступного місяця  учень може бути виключеним
						із закладу.
					</p>
					<p>
						Зобов’язуюсь щомісячно вносити до 10 числа поточного місяця визначену плату за навчання
						(надання платних послуг) з вересня по травень включно.
					</p>
				</Col>
			</Row>
			<Row className="text-center f1-form-signature">
				<Col>
					<p>
						«____»_____________________20___ р.
					</p>
				</Col>
				<Col>
					<p>
						Підпис______________________
					</p>
				</Col>
			</Row>
		</Container>
	</>
}

const mapStateToProps = state => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setFetchingData,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilFormF1)
