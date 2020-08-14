import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import 'bootstrap/dist/css/bootstrap.css'
import './css/index.css'

const render = () => {
	ReactDOM.render(
		<Provider store={store}>
			<GoogleReCaptchaProvider
				language="uk-UA"
				reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
				<App />
			</GoogleReCaptchaProvider>
		</Provider>,
		document.getElementById('root')
	)
}

render()
store.subscribe(render)
