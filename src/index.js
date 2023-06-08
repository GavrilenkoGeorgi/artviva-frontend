import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import Interceptor from './utils/interceptor.js'

import App from './App'
import Footer from './components/common/layout/Footer'

import 'bootstrap/dist/css/bootstrap.css'
import './css/index.css'

Interceptor.interceptor(store)

const render = () => {
	ReactDOM.render([
		<Provider store={store} key="app">
			<GoogleReCaptchaProvider
				language="uk-UA"
				reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
				<App />
			</GoogleReCaptchaProvider>
		</Provider>, <Footer key="footer"/>],
	document.getElementById('root')
	)
}

render()
store.subscribe(render)
