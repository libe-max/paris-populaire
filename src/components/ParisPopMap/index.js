import React, { Component } from 'react'
import ReactMapboxGL from 'react-mapbox-gl'
import mapStyle from './map-style.json'

const token = `pk.eyJ1Ijoib
GliZS1tYXgiLCJhIjoiY2pvaDBw
MDV3MGVvNDN3b2EwaXZjNTh5ZiJ
9.OAddWXBWmbQk1-mgBWyQLA`

const Map = ReactMapboxGL({
  accessToken: token
})

export default class ParisPopMap extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass

    // Detect WebGLRenderingContext
    const canvas = document.createElement('canvas')
    if (canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl')) {
      this.webgl = true
    } else {
      this.webgl = false
    }
  }

  render () {
    const { c, props, webgl } = this

    return <div className={`${c}__map`}>{
      webgl
        ? <Map style={mapStyle}
          containerStyle={{ width: '100%', height: '100%' }} />
        : 'Can not display map'
    }</div>
  }
}
