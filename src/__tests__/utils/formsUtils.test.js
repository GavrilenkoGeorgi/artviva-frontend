import { fieldChoices, calculatePercent } from '../../utils/formsUtils'
import { select } from '../../data/forms/teacherFields.json'

const expectedSelectOptions = {
	gender: [ 'Чоловіча', 'Жіноча' ],
	qualification: [
		'Немає кваліфікаціїной категорії',
		'ІІ категорія',
		'І категорія',
		'Вища категорія'
	],
	educationType: [ 'Повна вища освіта', 'Базова вища освіта', 'Неповна вища освіта' ],
	educationDegree: [ 'Магістр', 'Спеціаліст', 'Бакалавр', 'Молодший спеціаліст' ],
	category: [
		9, 10, 11, 12, 13,
		14, 15, 16, 17
	],
	teacherTitle: [
		'Немає педагогічного звання',
		'Старший викладач',
		'Викладач-методист'
	],
	employeeType: [ 'Штатний співробітник', 'Сумісник' ],
	residence: [ 'Місто', 'Село' ],
	maritalStatus: [ 'Одружений', 'Не одружений', 'Вдівець/Вдова' ],
	scienceDegree: [ 'Немає наукової ступені', 'Доктор наук', 'Кандидат наук' ]
}

describe('Form utils', () => {
	it('"fieldChoices" util generates object with input names and list of selectable values', () => {
		const result = fieldChoices(select)
		expect(result).toMatchObject(expectedSelectOptions)
	})

	it('"fieldChoices" util throws error if supplied with an empty array of items', () => {
		expect(() => fieldChoices([]))
			.toThrowError('Field choices object for validation schema is empty.')
	})

	it('"calculatePercent" correctly calculates percent from number', () => {
		const result = calculatePercent(1.5, 200)
		expect(result).toEqual(3)
	})

	it('"calculatePercent" throws an error if there is no result to return ', () => {
		expect(() => calculatePercent('a', 100))
			.toThrowError('Can\'t calculate percent for given data.')
	})
})
