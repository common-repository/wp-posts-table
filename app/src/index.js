import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './containers/app'

const target = document.querySelector('#ptd-root')

render(
	<Provider store={store}>
		<App />
	</Provider>,
	target
)
