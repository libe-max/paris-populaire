import React, { Component } from 'react'
import MapboxGL from 'react-mapbox-gl'

export default class MapBoxGL extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.state = {
      map: {
        center: props.initCenter,
        zoom: [props.initZoom * 0.95],
        maxBounds: props.maxBounds,
        minZoom: props.minZoom,
        token: props.token,
        style: props.mapStyle
      }
    }
    this.Map = MapboxGL({
      minZoom: props.minZoom,
      accessToken: props.token || ''
    })
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * WILL UNMOUNT
   *
   * * * * * * * * * * * * * * * */
  componentWillUnmount () {
    console.log('UNMOUNT !')
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY TO
   *
   * * * * * * * * * * * * * * * */
  flyTo (lon, lat) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: [lon, lat]
      }
    }))
  }

  /* * * * * * * * * * * * * * * *
   *
   * ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  zoomTo (z) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        zoom: [z * 0.95]
      }
    }))
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY AND ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  flyAndZoomTo (lon, lat, z) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: [lon, lat],
        zoom: [z * 0.95]
      }
    }))
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { state, props, Map } = this
    const { children } = props
    const { map } = state

    return <Map style={map.style}
      maxBounds={map.maxBounds}
      center={map.center}
      zoom={map.zoom}
      containerStyle={{ width: '100%', height: '100%' }}>
      {children}
    </Map>
  }
}
