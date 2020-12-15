import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import store from '../../../store'
import UsersListView from '../../../components/views/school/UsersListView'

import axiosMock from 'axios'
import mockedUsersData from '../../../fixtures/users.json'
import user from '../../../fixtures/user.json'
import UserDataContext from '../../../context/UserDataContext'

const customRender = (ui, { providerProps, ...renderOptions }) => {
	return render(
		<Provider store={store}>
			<UserDataContext.Provider {...providerProps}>
				<Router>
					{ui}
				</Router>
			</UserDataContext.Provider>
		</Provider>,
		renderOptions
	)
}

describe('<UsersListView /> component', () => {

	beforeEach(async () => {
		axiosMock.get.mockResolvedValue({ data: mockedUsersData })
		const providerProps = {
			value: user,
		}
		customRender(<UsersListView />, { providerProps })
	})

	it.only('renders correctly', async () => {
		const [ firstUser, secondUser ] = mockedUsersData

		expect(screen.getByText('Всі користувачі')).toBeInTheDocument()
		expect(screen.getByText(`${firstUser.name} ${firstUser.middlename} ${firstUser.lastname}`))
			.toBeInTheDocument()
		expect(screen.getByText(`${secondUser.name} ${secondUser.middlename} ${secondUser.lastname}`))
			.toBeInTheDocument()
	})

})
