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
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
  }

  flyTo (lon, lat) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: [lon, lat]
      }
    }))
  }

  zoomTo (z) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        zoom: [z]
      }
    }))
  }

  flyAndZoomTo (lon, lat, z) {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: [lon, lat],
        zoom: [z]
      }
    }))
  }

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
