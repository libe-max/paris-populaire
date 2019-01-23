import React from 'react'
import ReactDOM from 'react-dom'
import ParisPopulaire from './ParisPopulaire'
import * as serviceWorker from './serviceWorker'
import config from './config.json'

ReactDOM.render(
  <ParisPopulaire {...config} />,
  document.getElementById('libe-labo-app-wrapper')
)

serviceWorker.unregister()
