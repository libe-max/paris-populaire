import React, { Component } from 'react'
import { Marker as MbMarker } from 'react-mapbox-gl'
import { CircleMarker as LfMarker, Popup as LfPopup } from 'react-leaflet'
import { Parser } from 'html-to-react'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import MapBoxGL from './components/MapBoxGL'
import LeafletMap from './components/LeafletMap'

/* Map parameters [WIP] app dependent */
import vectorMapStyle from './map-style.json'
const rasterTiles = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
const rasterAttribution = '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
const maxBounds = [[1.860, 48.613], [2.824, 49.100]]
const initCenter = [2.342, 48.854]
const offsetCenter = [2.20, 48.854]
const initZoom = 11.5
const minZoom = 10

export default class ParisPopMap extends Component {

  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = props.appRootClass // [WIP] app dependent
    this.state = {
      webgl: false,
      center: initCenter,
      zoom: initZoom,
      max_bounds: maxBounds,
      min_zoom: minZoom,
      raster_tiles: rasterTiles,
      raster_attribution: rasterAttribution,
      vector_style: vectorMapStyle
    }
    this.h2r = new Parser() // [WIP] app dependent
    this.checkWebGl = this.checkWebGl.bind(this)
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
    this.resetZoom = this.resetZoom.bind(this)
    this.shiftCenterAndZoom = this.shiftCenterAndZoom.bind(this) // [WIP] app dependent
    this.resetCenterAndZoom = this.resetCenterAndZoom.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.checkWebGl()
    return
  }

  /* * * * * * * * * * * * * * * *
   *
   * CHECK WEBGL
   *
   * * * * * * * * * * * * * * * */
  checkWebGl () {
    const canvas = document.createElement('canvas')
    const webgl = canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (webgl) this.setState({ webgl })
    return
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY TO
   *
   * * * * * * * * * * * * * * * */
  flyTo (lon, lat) {
    const { mapBoxGL, leaflet } = this
    if (mapBoxGL && mapBoxGL.flyTo) mapBoxGL.flyTo(lon, lat)
    if (leaflet && leaflet.flyTo) leaflet.flyTo(lon, lat)
    return this.setState({ center: [lon, lat] })
  }

  /* * * * * * * * * * * * * * * *
   *
   * ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  zoomTo (z) {
    const { mapBoxGL, leaflet } = this
    if (mapBoxGL && mapBoxGL.zoomTo) mapBoxGL.zoomTo(z)
    if (leaflet && leaflet.zoomTo) leaflet.zoomTo(z)
    return this.setState({ zoom: z })
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY AND ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  flyAndZoomTo (lon, lat, z) {
    const { mapBoxGL, leaflet } = this
    if (mapBoxGL && mapBoxGL.flyAndZoomTo) mapBoxGL.flyAndZoomTo(lon, lat, z)
    if (leaflet && leaflet.flyAndZoomTo) leaflet.flyAndZoomTo(lon, lat, z)
    return this.setState ({
      center: [lon, lat],
      zoom: z
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * RESET ZOOM
   *
   * * * * * * * * * * * * * * * */
  resetZoom () {
    this.zoomTo(initZoom)
  }

  /* * * * * * * * * * * * * * * *
   *
   * RESET CENTER AND ZOOM
   *
   * * * * * * * * * * * * * * * */
  resetCenterAndZoom () {
    this.flyAndZoomTo(...initCenter, initZoom)
  }

  /* * * * * * * * * * * * * * * *
   *
   * SHIFT CENTER AND ZOOM
   * [WIP] app dependent
   *
   * * * * * * * * * * * * * * * */
  shiftCenterAndZoom () {
    this.flyAndZoomTo(...offsetCenter, initZoom)
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props, state } = this
    const { webgl } = state
    // const webgl = false
    // [WIP] app dependent
    const {
      pageIsReady,   places,         activeFilter,
      activePlaceId, activatePlace
    } = props

    // Mapbox children [WIP] app dependent
    const mapboxChildren = places.map(place => {
      const { longitude: lon, latitude: lat, id, exists } = place
      const filterType = activeFilter ? activeFilter.type : null
      const filterValue = activeFilter ? activeFilter.value : null
      const placeFilters = place[`_${filterType}`] || []
      const inFilter = filterValue ? (placeFilters.indexOf(filterValue) > -1) : true
      return <MbMarker key={id}
        anchor='center'
        coordinates={[lon, lat]}
        onClick={() => activatePlace(id)}>
        <div className={`${c}__mb-map-marker
          ${c}__mb-map-marker_${inFilter ? 'in-filter' : 'out-filter'}
          ${c}__mb-map-marker_${exists ? 'exists' : 'not-exists'}
          ${c}__mb-map-marker_${activePlaceId === id ? 'active' : 'inactive'}`}>
          <div className={`${c}__mb-map-marker-tooltip`}>
            <Annotation>{this.h2r.parse(place.name)}</Annotation>
          </div>
        </div>
      </MbMarker>
    })

    // Leaflet children [WIP] app dependent
    const leafletChildren = places.filter(place => {
      const filterType = activeFilter ? activeFilter.type : null
      const filterValue = activeFilter ? activeFilter.value : null
      const placeFilters = place[`_${filterType}`] || []
      const inFilter = filterValue ? (placeFilters.indexOf(filterValue) > -1) : true
      return inFilter
    }).map(place => {
      const { longitude: lon, latitude: lat, id, exists } = place
      return <LfMarker key={id}
        radius={7}
        center={[lat, lon]}
        ref={n => this[`lfMarker_${id}`] = n}
        onClick={() => activatePlace(id)}
        onMouseOver={() => this[`lfMarker_${id}`].leafletElement.openPopup()}
        onMouseOut={() => {this[`lfMarker_${id}`].leafletElement.closePopup()}}
        className={`${c}__lf-map-marker
          ${c}__lf-map-marker_${exists ? 'exists' : 'not-exists'}
          ${c}__lf-map-marker_${activePlaceId === id ? 'active' : 'inactive'}`}>
          <LfPopup><Annotation>{this.h2r.parse(place.name)}</Annotation></LfPopup>
        </LfMarker>
    })

    if (!pageIsReady) return <div />
    return <div className={`${c}__map`}>{
      webgl
        ? <MapBoxGL ref={n => this.mapBoxGL = n}
          minZoom={state.min_zoom}
          maxBounds={state.max_bounds}
          mapStyle={state.vector_style}
          initCenter={state.center}
          initZoom={state.zoom}>
          {mapboxChildren}
        </MapBoxGL>
        : <LeafletMap ref={n => this.leaflet = n}
          rasterTiles={state.raster_tiles}
          rasterAttribution={state.raster_attribution}
          minZoom={state.min_zoom}
          maxBounds={state.max_bounds}
          initCenter={state.center}
          initZoom={state.zoom}>
          {leafletChildren}
        </LeafletMap>
    }</div>
  }
}
