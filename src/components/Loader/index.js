import React, { Component } from 'react'
import loader from './assets/loader.gif'

export default class Loader extends Component {
  render () {
    return <div class="lblb-loading-icon">
      <img alt="Loader asset" src={loader} />
    </div>
  }
}
