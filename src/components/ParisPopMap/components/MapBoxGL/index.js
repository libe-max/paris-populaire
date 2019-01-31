import React, { Component } from 'react'
import ReactMapboxGL, { Layer, Feature } from 'react-mapbox-gl'
import PageTitle from 'libe-components/lib/text-levels/PageTitle'

export default class MapBoxGL extends Component {
  constructor (props) {
    super(props)
    this.Map = ReactMapboxGL({
      minZoom: props.minZoom,
      accessToken: props.token
    })
    this.state = {
      map: {
        center: props.initCenter,
        zoom: props.initZoom,
        maxBounds: props.maxBounds,
        style: props.mapStyle
      }
    }
  }

  render () {
    const { state, props, Map } = this
    const { map } = state
    const { layers } = props


    return <Map style={map.style}
      maxBounds={map.maxBounds}
      center={map.center}
      zoom={map.zoom}
      containerStyle={{ width: '100%', height: '100%' }}>{
      layers
    }</Map>
  }
}
