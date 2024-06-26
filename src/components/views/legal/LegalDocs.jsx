import React from 'react'
import { Helmet } from 'react-helmet'

import CommonLayout from '../../CommonLayout'
import QuestionnaireCTA from '../../announcements/QuestionnaireCTA'
import Banner from '../../../components/announcements/Banner'
import links from '../../../data/legalDocsLinks.json'

const LegalDocs = () => {

	const pdfLinkComp = (title, link, humanReadableTitle) => {
		return <li key={link}>
			<a target="_blank" rel="noopener noreferrer" href={link}>
				{title}
			</a><br />
			<a target="_blank" rel="noopener noreferrer" href={link}>
				{humanReadableTitle ? humanReadableTitle : link }
			</a>
		</li>
	}

	return <>
		<Helmet>
			<title>Нормативна база школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Нормативна база, якою керується у своїй діяльності школа мистецтв «АРТ ВІВА»" />
		</Helmet>
		<Banner />
		<CommonLayout>
			<section className="page-container">
				<h1>
					Нормативна база, якою керується у своїй діяльності школа
				</h1>

				<aside className='py-4'>
					<QuestionnaireCTA />
				</aside>

				<h2>Порядок реагування на доведені випадки булінгу</h2>
				<p>
					Порядок реагування на доведені випадки булінгу (цькування)
					в закладі освіти (відповідно до листа МОНУ від 29.01.2019
					№1/11-881 &quot;Рекомендації для закладів освіти щодо застосування
					норм Закону України &quot;Про внесення змін до деяких законодавчих
					актів України щодо протидії булінгу (цькування) від 18.12.2018 №2657-VIII&quot;)
				</p>
				<p>
					В разі підтвердження факту вчинення булінгу (цькування), за результатами
					розслідування та висновків Комісії, створеної у закладі освіти з розгляду
					випадків булінгу, повідомляються уповноважені підрозділи органів
					Національної поліції України та служби у справах дітей про випадки
					булінгу (цькування) в закладі освіти.
				</p>
				<p>
					Виконується рішення та рекомендації комісії з розгляду випадків булінгу
					(цькування) в закладі освіти.
				</p>
				<p>
					Надаються соціальні та психолого-педагогічні послуги здобувачам освіти,
					які вчинили булінг, стали його свідками або постраждали від булінгу.
				</p>
				<p>
					Визначаються відповідальні особи, причетні до булінгу (цькування) та
					накладаються адміністративні стягнення:
				</p>
				<ul>
					<li>
						цькування неповнолітнього карається штрафом від 50 до 100
						неоподатковуваних мінімумів доходів громадян (850 та 1700 гривень
						відповідно) або громадськими роботами від 20 до 40 годин.
					</li>
					<li>
						така ж поведінка, вчинена групою осіб або повторно протягом року
						після накладення адміністративного стягнення, передбачає штраф від
						1700 гривень до 3400 гривень або громадськими роботами від 40 до 60 годин.
					</li>
					<li>
						за булінг, вчинений малолітніми або неповнолітніми особами віком від
						14 до 16 років,тягне за собою накладання штрафу на батьків або осіб,
						які їх замінюють.
					</li>
				</ul>

				<h2>Інформаційна відкритість:</h2>
				<ul>
					{links.pdf.map(item => {
						return pdfLinkComp(item.title, item.link, item.humanReadableTitle)
					})}
				</ul>

				<h2>Правові документи:</h2>
				<ul>
					{links.legalDocs.map(item => {
						return pdfLinkComp(item.title, item.link)
					})}
				</ul>

				<h2>Закони України:</h2>
				<ul>
					{links.laws.map(item => {
						return pdfLinkComp(item.title, item.link)
					})}
				</ul>

			</section>
		</CommonLayout>
	</>
}

export default LegalDocs
