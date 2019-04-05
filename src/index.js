import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './pages/App'
import * as serviceWorker from './services/serviceWorker'

import 'bootstrap/dist/css/bootstrap.css'
import 'typeface-roboto'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
