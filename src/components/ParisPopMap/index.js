import React, { Component } from 'react'
// import { Marker as MbMarker } from 'react-mapbox-gl'
import { CircleMarker as LfMarker, Popup as LfPopup } from 'react-leaflet'
import { Parser } from 'html-to-react'
import Annotation from 'libe-components/lib/text-levels/Annotation'
// import MapBoxGL from './components/MapBoxGL'
import LeafletMap from './components/LeafletMap'

/* Map parameters [WIP] app dependent */
import vectorMapStyle from './map-style.json'
const rasterTiles = 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png'
const rasterAttribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const maxBounds = [[1.860, 48.616], [2.824, 49.103]]
const initCenter = [2.342, 48.857]
const offsetCenter = [2.2725, 48.857]
const initZoom = window.innerWidth > 1008 ? 13 : 11
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
      max_bounds: [[...maxBounds[0]], [...maxBounds[1]]],
      min_zoom: minZoom,
      raster_tiles: rasterTiles,
      raster_attribution: rasterAttribution,
      vector_style: vectorMapStyle,
      user_position: null
    }
    this.h2r = new Parser() // [WIP] app dependent
    this.checkWebGl = this.checkWebGl.bind(this)
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
    this.resetZoom = this.resetZoom.bind(this)
    this.shiftCenterAndZoom = this.shiftCenterAndZoom.bind(this) // [WIP] app dependent
    this.resetCenterAndZoom = this.resetCenterAndZoom.bind(this)
    this.getClientPosition = this.getClientPosition.bind(this)
    this.getClientPosition()
    window.setInterval(this.getClientPosition, 6000)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.checkWebGl()
  }

  /* * * * * * * * * * * * * * * *
   *
   * WILL UNMOUNT
   *
   * * * * * * * * * * * * * * * */
  componentWillUnmount () {
    window.clearInterval(this.getClientPosition)
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
    return this.setState({
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
   * GET CLIENT POSITION
   *
   * * * * * * * * * * * * * * * */
  getClientPosition () {
    if ('geolocation' in navigator) {
      const { geolocation } = navigator
      this.gpsWatcher = geolocation.watchPosition(pos => {
        const { longitude, latitude, accuracy } = pos.coords
        this.setState({
          user_position: {
            center: [longitude, latitude],
            accuracy: accuracy
          }
        })
      }, null, {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      })
    }
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props, state, h2r } = this
    // const { webgl } = state [WIP] this should work
    // const webgl = false
    // [WIP] app dependent
    const {
      pageIsReady, places, activeFilter,
      activePlaceId, activatePlace
    } = props
    const { user_position: userPosition } = state

    // Mapbox children [WIP] app dependent
    // const mapboxChildren = places.map(place => {
    //   const { longitude: lon, latitude: lat, id, exists } = place
    //   const filterType = activeFilter ? activeFilter.type : null
    //   const filterValue = activeFilter ? activeFilter.value : null
    //   const placeFilters = place[`_${filterType}`] || []
    //   const inFilter = filterValue ? (placeFilters.indexOf(filterValue) > -1) : true
    //   return <MbMarker key={id}
    //     anchor='center'
    //     coordinates={[lon, lat]}
    //     onClick={() => activatePlace(id)}>
    //     <div className={`${c}__mb-map-marker
    //       ${c}__mb-map-marker_${inFilter ? 'in-filter' : 'out-filter'}
    //       ${c}__mb-map-marker_${exists ? 'exists' : 'not-exists'}
    //       ${c}__mb-map-marker_${activePlaceId === id ? 'active' : 'inactive'}`}>
    //       <div className={`${c}__mb-map-marker-tooltip`}>
    //         <Annotation>{this.h2r.parse(place.name)}</Annotation>
    //       </div>
    //     </div>
    //   </MbMarker>
    // })

    // Leaflet children [WIP] app dependent
    const leafletChildren = places.filter(place => {
      const filterType = activeFilter ? activeFilter.type : null
      const filterValue = activeFilter ? activeFilter.value : null
      const placeFilters = place[`_${filterType}`] || []
      const inFilter = filterValue ? (placeFilters.indexOf(filterValue) > -1) : true
      return inFilter
    }).map(place => {
      const {
        display_lifespan: rawDisplayLifespan,
        longitude: lon,
        latitude: lat,
        exists,
        id
      } = place
      const startYear = place.lifespan.start_date.year()
      const endYear = place.lifespan.end_date.year()
      const displayLifespan = rawDisplayLifespan
        ? `(${h2r.parse(rawDisplayLifespan)})`
        : startYear === endYear
          ? `(${startYear})`
          : h2r.parse(`(${startYear}&nbsp;-&nbsp;${endYear})`)
      return <LfMarker key={id}
        radius={8}
        center={[lat, lon]}
        ref={n => { this[`lfMarker_${id}`] = n }}
        onClick={() => activatePlace(id)}
        onMouseOver={() => this[`lfMarker_${id}`].leafletElement.openPopup()}
        onMouseOut={() => { this[`lfMarker_${id}`].leafletElement.closePopup() }}
        className={`${c}__lf-map-marker
          ${c}__lf-map-marker_${exists ? 'exists' : 'not-exists'}
          ${c}__lf-map-marker_${activePlaceId === id ? 'active' : 'inactive'}`}>
        <LfPopup>
          <Annotation>{h2r.parse(place.name)} {displayLifespan}</Annotation>
        </LfPopup>
      </LfMarker>
    })

    // Add user position
    const [[westBound, southBound], [eastBound, northBound]] = maxBounds
    const [userLon, userLat] = userPosition ? userPosition.center : [null, null]
    const userIsInParis = userLon > westBound &&
      userLon < eastBound &&
      userLat > southBound &&
      userLat < northBound
    if (userIsInParis) {
      // [WIP] should work in mapbox also
      leafletChildren.push(<LfMarker key='user-position'
        center={[userLat, userLon]}
        radius={6}
        ref={n => { this['lfMarker_user-position'] = n }}
        onMouseOver={() => this['lfMarker_user-position'].leafletElement.openPopup()}
        onMouseOut={() => { this['lfMarker_user-position'].leafletElement.closePopup() }}
        className={`${c}__lf-map-marker ${c}__lf-map-marker_user-position`}>
        <LfPopup><Annotation>Vous êtes ici</Annotation></LfPopup>
      </LfMarker>)
    }

    if (!pageIsReady) return <div />

    // [WIP] Abandonned this part
    // return <div className={`${c}__map`}>{
    //   webgl
    //     ? <MapBoxGL ref={n => this.mapBoxGL = n}
    //       minZoom={state.min_zoom}
    //       maxBounds={[...state.max_bounds]}
    //       mapStyle={state.vector_style}
    //       initCenter={state.center}
    //       initZoom={state.zoom}>
    //       {mapboxChildren}
    //     </MapBoxGL>
    //     : <LeafletMap ref={n => this.leaflet = n}
    //       rasterTiles={state.raster_tiles}
    //       rasterAttribution={state.raster_attribution}
    //       minZoom={state.min_zoom}
    //       maxBounds={[...state.max_bounds]}
    //       initCenter={state.center}
    //       initZoom={state.zoom}>
    //       {leafletChildren}
    //     </LeafletMap>
    // }</div>

    return <div className={`${c}__map`}>{
      <LeafletMap ref={n => { this.leaflet = n }}
        rasterTiles={state.raster_tiles}
        rasterAttribution={state.raster_attribution}
        minZoom={state.min_zoom}
        maxBounds={[...state.max_bounds]}
        initCenter={state.center}
        initZoom={state.zoom}>
        {leafletChildren}
      </LeafletMap>
    }</div>
  }
}
