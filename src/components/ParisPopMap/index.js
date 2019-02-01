import React, { Component } from 'react'
import { Layer, Feature, Marker } from 'react-mapbox-gl'
import { Parser } from 'html-to-react'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import MapBoxGL from './components/MapBoxGL'
import LeafletMap from './components/LeafletMap'

import token from '../../.mapbox-token'
// import mapStyle from './map-style.json'

const mapStyle = 'mapbox://styles/libe-max/cjrj00aqu6ydy2snu1lf36lgi'
const maxBounds = [[1.860, 48.613], [2.824, 49.100]]
const initCenter = [2.342, 48.854]
const initZoom = [11.5]
const minZoom = 10

export default class ParisPopMap extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.h2r = new Parser()
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)

    // Detect WebGLRenderingContext
    const canvas = document.createElement('canvas')
    const webGl = canvas.getContext('webgl')
    const expWebGl = canvas.getContext('experimental-webgl')
    if (webGl || expWebGl) this.webgl = true
    else this.webgl = false
  }

  flyTo (lon, lat) {
    if (this.mapBoxGL && this.mapBoxGL.flyTo) this.mapBoxGL.flyTo(lon, lat)
    if (this.leaflet && this.leaflet.flyTo) this.leaflet.flyTo(lon, lat)
    return [lon, lat]
  }

  zoomTo (z) {
    if (this.mapBoxGL && this.mapBoxGL.zoomTo) this.mapBoxGL.zoomTo(z)
    if (this.leaflet && this.leaflet.zoomTo) this.leaflet.zoomTo(z)
    return z
  }

  flyAndZoomTo (lon, lat, z) {
    if (this.mapBoxGL && this.mapBoxGL.flyAndZoomTo) this.mapBoxGL.flyAndZoomTo(lon, lat, z)
    if (this.leaflet && this.leaflet.flyAndZoomTo) this.leaflet.flyAndZoomTo(lon, lat, z)
    return {
      center: [lon, lat],
      zoom: z
    }
  }

  render () {
    const { c, props, state, webgl } = this
    const {
      pageIsReady,
      places,
      activeFilter,
      activePlaceId,
      activatePlace,
      unactivatePlace
    } = props

    const mapboxChildren = places.map(place => {
      const { longitude: lon, latitude: lat, id, exists } = place
      const filterType = activeFilter ? activeFilter.type : null
      const filterValue = activeFilter ? activeFilter.value : null
      const placeFilters = place[`_${filterType}`] || []
      const inFilter = filterValue ? (placeFilters.indexOf(filterValue) > -1) : true
      return <Marker key={id}
        anchor="center"
        coordinates={[lon, lat]}
        onClick={() => activatePlace(id)}>
        <div className={`
          ${c}__map-marker
          ${c}__map-marker_${inFilter ? 'in-filter' : 'out-filter'}
          ${c}__map-marker_${exists ? 'exists' : 'not-exists'}
          ${c}__map-marker_${activePlaceId === id ? 'active' : 'inactive'}
          `.replace(/\s{2,}/g, ' ').trim()}>
          <div className={`${c}__map-marker-tooltip`}>
            <Annotation>{this.h2r.parse(place.name)}</Annotation>
          </div>
        </div>
      </Marker>
    })

    if (!pageIsReady) return <div />
    return <div className={`${c}__map`}>{
      webgl
        ? <MapBoxGL token={token}
          ref={n => this.mapBoxGL = n}
          minZoom={minZoom}
          maxBounds={maxBounds}
          mapStyle={mapStyle}
          initCenter={initCenter}
          initZoom={initZoom}>
          {mapboxChildren}
        </MapBoxGL>
        : <LeafletMap places={places} />
    }</div>
  }
}
