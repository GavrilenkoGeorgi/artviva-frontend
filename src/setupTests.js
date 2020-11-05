import '@testing-library/jest-dom/extend-expect'
// mock the backend response with the list of blogs
// jest.mock('./services/blogs')
import { configure } from '@testing-library/react'
import 'jest-canvas-mock'

// i already have cypress data tags on the elements
configure({ testIdAttribute: 'data-cy' })

let savedItems = {}

const localStorageMock = {
	setItem: (key, item) => {
		savedItems[key] = item
	},
	getItem: (key) => savedItems[key],
	removeItem: (key) => {
		savedItems[key] = undefined
	},
	clear: () => {
		savedItems = {}
	}
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
