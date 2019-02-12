import React, { Component } from 'react'
import { Map as Leaflet, TileLayer, Marker } from 'react-leaflet'

export default class LeafletMap extends Component {

  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.state = {
      map: {
        center: props.initCenter.reverse(),
        zoom: props.initZoom[0],
        maxBounds: props.maxBounds.map(bound => bound.reverse()),
        minZoom: props.minZoom
      }
    }
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { state, props } = this
    const { map } = state
    const { children } = props
    return <Leaflet center={map.center}
      zoom={map.zoom}
      maxBounds={map.maxBounds}
      minZoom={map.minZoom}>
      <TileLayer
        url='https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
        attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors' />
      {children}
    </Leaflet>
  }
}
