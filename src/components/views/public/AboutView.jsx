import React from 'react'
import { Helmet } from 'react-helmet'

import AboutTextImage from '../../common/AboutTextImage'
import CommonLayout from '../../CommonLayout'
import styles from './AboutView.module.sass'

const AboutView = () => {
	return <CommonLayout>
		<Helmet>
			<title>Історія школи мистецтв «АРТ ВІВА»</title>
			<meta
				name="description"
				content="40 років діяльності навчального закладу і багата історія перших починань та досягнень."
			/>
		</Helmet>
		<section className={styles.section}>
			<article className={styles.article}>
				<h1>
					Історія
				</h1>
				<p className={styles.quote}>
					<em>Музика, не згадуючи ні npo що, може сказати все.</em>
					<br />
					<span>І. Г. Еренбург</span>
				</p>

				<p className={styles.aboutText}>
					<strong>Позаду 40 років діяльності навчального закладу</strong> і багата історія перших
					починань та досягнень. Ми з гордістю і великою шаною згадуємо людей,
					які стояли на першоджерелах музичної школи і передали свій талант
					майбутнім поколінням. Історія заснування Шпитьківськоі школи мистецтв
					починається з відкриття в селі Шпитьки філії Бузівської музичної школи,
					яку очолював Вишнівський Віталій Миколайович. У 1978 році у західній
					частині села, де знаходився парк садиби Олександра Терещенка і зростало
					багато вікових дерев, у будівлі, де спочатку розміщувалася сільська рада,
					а потім молодша загальноосвітня школа, управлінням культури було прийнято
					рішення відкрити у великому, на той час, приміщенні &mdash; Шпитьківську
					музичну школу. Керівником призначено Литвина Андрія Васильовича, а його
					заступником з навчально-виховноі роботи &mdash; Розарьонову Тетяну Василівну.
				</p>

				<AboutTextImage
					src="img/about/aboutArtviva00.jpg"
					alt="Групове фото складу школи."
					classList={styles.wideImgMargins}
				/>

				<p className={styles.aboutText}>
					На початку діяльності у школі займалося 55 учнів. Протягом п&apos;яти років
					було відкрито нові класи, а також філія у селі Білогородка, яка працювала на
					базі будинку культури. Розповідаючи про історію школи, не можна обійти своєю
					увагою той факт, що саме тут 35 років тому <strong>працював викладачем по класу
					віолончелі 3авальський Олександр Андрійович &mdash; зірковий батько співачок
					Аліни та Анни Завальських (дует «Алібі»).</strong>
				</p>

				<AboutTextImage
					src="img/about/aboutArtviva01.jpg"
					alt="Виїзний концерт на підприємстві."
					classList={styles.wideImgMargins}
				/>

				<p className={styles.aboutText}>
					З 1984 року школу очолила Щербак Неля Юріївна, посаду заступника з
					навчально-виховної роботи зайняла Романчишина Людмила Іванівна. Кабінет
					директора школи знаходився в Білогородській філії, так як Неля Юріївна була
					жителькою цього села. Можливо, тому за часів її керівництва цей осередок
					естетичного виховання набув найбільшого розквіту. Школа опанувала <strong>нові форми і
					методи навчання, учні досягали високих результатів.</strong> Навчання велось у класах
					фортепіано, скрипки, бандури, баяна, акордеона, духових інструментів. За двадцять
					років господарювання на високому рівні був відділ народних інструментів,
					створювалися ансамблі, відкриті філії в селах Гореничі та Дмитрівка. Учні разом
					з викладачами їздили з благодійними концертами в поля, на ферми, тепличні комплекси.
				</p>

				<p className={styles.aboutText}>
					<AboutTextImage
						src="img/about/aboutArtviva02.jpg"
						float="left"
						width="24rem"
						maxWidth="100%"
						classList={styles.inlineImgMarginsLeft}
						alt="Оркестр школи перед будинком культури"
					/>
					Випали на долю школи і часи фінансової нестабільності, кризи, недостатнього
					забезпечення, скорочення посад, навчальних планів, навіть закриття закладу,
					але <strong>зусиллями викладачів та вихованців збереглися традиції школи і її діяльність</strong>.
					3 2004 року посаду директора зайняла Ноздріна Валентина Павлівна (2004-2006)
					разом із своїм заступником Мовчун Галиною Анатоліївною розпочали новий етап
					розвитку навчально виховного процесу. Учні та викладачі відвідували обласні
					конкурси та методичні об&apos;єднання, також високого рівня набуває сольний спів,
					було засновано оркестр духових інструментів, випускники школи вступали до вищих
					музичних закладів.
				</p>

				<p className={styles.aboutText}>
					За часів керівництва Ільїна Віктора Тихоновича (2006-2009), Шпитьківська музична
					<AboutTextImage
						src="img/about/aboutArtviva03.jpg"
						float="right"
						width="24rem"
						maxWidth="100%"
						classList={styles.inlineImgMarginsRight}
						alt="Колектив перед входом в будівлю школи"
					/>
					школа здобула статус школи мистецтв, у зв&apos;язку з відкриттям класу хореографії
					у 2007 році. Кількість учнів школи зросла до 200 дітей. Окрім цього Віктор Тихонович
					започаткував нелегку справу - газифікування навчального закладу. Таким чином ним <strong>
					у 2008 році було побудовано сучасну котельню та школа почала опалюватись природнім газом.</strong>
				</p>

				<p className={styles.aboutText}>
					3 2009 року починає свою роботу <strong>молодий, енергійний директор, досвідчений викладач
					по класу вокалу — Іванчук Олена Анатоліївна</strong>, замісником залишається незамінна
					Мовчун Галина Анатоліївна. Кількість учнів у Шпитьках та філіях сіл: Білогородка,
					Дмитрівка, Гореничі, Михайлівська Рубежівка, Музичі разом складала майже 200 чоловік.
					Першим та головним завданням на той час було створити належні умови для навчання та
					продуктивної роботи. Гострим питанням стояло облаштування санвузла в приміщенні школи.
					Як то кажуть: «Головне &mdash; почати!». За підтримки Шпитьківської сільської ради та
					<AboutTextImage
						src="img/about/aboutArtviva04.jpg"
						float="left"
						width="24rem"
						maxWidth="100%"
						classList={styles.inlineImgMarginsLeft}
						alt="Завуч і директор школи"
					/>
					депутатів в період літніх канікул 2010 року був зроблений довгоочікуваний ремонт в
					приміщенні школи. Діти та викладачі отримали чудові світлі класи, де дуже затишно
					і приємно працювати. Згодом школу було утеплено, укомплектовано міні-котельню,
					покладені доріжки, паркан та навіть облаштовано паркінг.
				</p>

				<p className={styles.aboutText}>
					<strong>Сьогодні на території школи проходять роботи по озелененню та ландшафтному дизайну</strong>,
					встановлено автоматичний полив та насаджено багато молодих рослин та дерев, що ще
					більше надихає до роботи та розвитку Шпитьківського позашкільного закладу, як осередку
					естетичного та культурного виховання дітей. Активна робота ведеться і на філіях
					Шпитьківської школи. За підтримки районної адміністрації та Білогородського сільського
					голови 3уєва Максима, який також є випускником нашої школи по класу баяна, був
					проведений капітальний ремонт шкільної будівлі в селі Білогородка. Побудовано санвузол
					в приміщенні школи, укомплектовані всім необхідним навчальні класи, запущено
					індивідуальне опалення та водопостачання. Також загальними зусиллями із сільськими
					радами сіл Гореничі, Дмитрівка, Михайлівська Рубежівка та Бузова, де класи знаходяться
					на базі будинків культури та загальноосвітніх шкіл <strong>створені належні умови для
					комфортного навчання учнів.</strong>
				</p>

				<AboutTextImage
					src="img/about/group-photo-recent.webp"
					alt="Групове фото працівників школи."
					classList={styles.wideImgMargins}
				/>

				<p className={styles.aboutText}>
					Господарська робота, звичайно, не повинна заважати і
					навчально-виховному процесу. В 2011 році школа успішно пройшла атестацію.
					<strong> Відкриваються нові класи:</strong> віолончелі, блок-флейти, саксофону, флейти, клас ударних
					інструментів, декоративно-прикладного мистецтва, спортивно-бойової хореографії
					естрадно-циркового та театрального мистецтв, група раннього розвитку для наших
					маленьких учнів. Створені нові інструментальні, хореографічні та вокальні колективи:
					ансамбль гітаристів, ансамбль скрипалів «Домінанта», зведений оркестр, тріо викладачів
					«Грація», маршовий оркестр барабанщиць «DrumStarBirds», хореографічні колективи
					«Перлина» та «Blago-Dance», спортивно-бойова хореографія «Шпитьківські козачата»,
					естрадно-циркова студія «Flick-Flyack», вокальні ансамблі «Перепілонька», «Веретенце»
					та «До-Мі-Солька». Дякуючи підтримці нашого району та місцевій владі поновлюється
					матеріально-технічна база. <strong>Придбано нові інструменти:</strong> баян, фортепіано, бандури,
					гітари, скрипки, віолончелі, блок-флейти, кларнети, саксофони, барабанні установки,
					акустичні професійні системи з мікрофонами для вокального відділу, а також закуплено
					потужну професійну апаратуру, яка сьогодні дає нам змогу озвучувати великі святкові
					заходи та концерти. Колективи одягнені в яскраві концертні костюми, а художній відділ
					забезпечений мольбертами та всім необхідним знаряддям. Сучасна епоха стрімкого
					розвитку комп&apos;ютерних технологій диктує свої правила і вносить корективи в
					навчальний процес і розвиток школи. <strong>Нові ноутбуки, радіо-мікрофони, плазмові телевізори
					та багатофункціональні пристрої допомагають нам рухатись в ногу із часом.</strong>
				</p>

				<p className={styles.aboutText}>
					З 01 березня 2021 року Комунальний заклад спеціалізованої мистецької освіти
					ШКОЛА МИСТЕЦТВ «АРТ ВІВА» очолила Мовчун Галина Анатоліївна, заступник директора
					з навчальної роботи, яка працює в школі вже 39 років.
				</p>

				<AboutTextImage
					src="img/about/classroom.webp"
					alt="Інтер'єр музичного класу."
					classList={styles.wideImgMargins}
				/>

				<p className={styles.aboutText}>
					Місія нашої школи-це підтримувати неповторну творчу, інтелектуальну атмосферу творення,
					взаємної поваги, взаємодопомоги і свободи самовираження. В умовах величезного
					інформаційного потоку зростає роль мистецької освіти, бо саме мистецтво має великий
					потенціал впливати на розвиток психічного та емоційного стану дитини, на реалізацію
					її інтелектуальних та духовних можливостей в подальщому житті. <br />
					Компетентність та високий професіоналізм нашого колективу, самореалізація,
					творча робота &mdash; все це об&apos;єднує колектив і надає можливість кожній дитині,
					що виявила бажання навчатися в нашій школі: <br />
					&mdash; здатність творчо мислити <br />
					&mdash; сформувати успішну особистість <br />
					&mdash; отримати  якісну освіту <br />
					&mdash; вступати до вищих мистецьких закладів <br />
					А для цього в нас є багато різносторонніх відділів та унікальна можливість
					вибрати дитині відповідно її вподобань.
				</p>

				<p className={styles.aboutText}>
					<strong>Ми маємо здійснювати принцип безперервної освіти: <em>навчання, виховання, розвиток.</em></strong>
				</p>
			</article>
		</section>

	</CommonLayout>
}

export default AboutView
