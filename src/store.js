
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'
import branchesReducer from './reducers/branchesReducer'
import specialtiesReducer from './reducers/specialtiesReducer'
import teachersReducer from './reducers/teachersReducer'
import pupilsReducer from './reducers/pupilsReducer'
import schoolStatsReducer from './reducers/schoolStatsReducer'
import schoolClassesReducer from './reducers/schoolClassesReducer'
import paymentsReducer from './reducers/paymentsReducer'
import teacherDataReducer from './reducers/teacherDataReducer'
// import { teacherDataReducer } from './reducers'

const reducer = combineReducers({
	user: loginReducer,
	users: userReducer,
	notification: notificationReducer,
	branches: branchesReducer,
	specialties: specialtiesReducer,
	teachers: teachersReducer,
	pupils: pupilsReducer,
	schoolStats: schoolStatsReducer,
	schoolClasses: schoolClassesReducer,
	payments: paymentsReducer,
	teacher: teacherDataReducer
})

const store = createStore(
	reducer,
	composeWithDevTools(
		applyMiddleware(thunk)
	)
)

export default store
