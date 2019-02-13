import React, { Component } from 'react'
import { Layer, Feature, Marker as MbMarker } from 'react-mapbox-gl'
import { CircleMarker as LfMarker, Popup as LfPopup } from 'react-leaflet'
import { Parser } from 'html-to-react'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import MapBoxGL from './components/MapBoxGL'
import LeafletMap from './components/LeafletMap'

export default class ParisPopMap extends Component {

  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.state = { webgl: false }
    this.h2r = new Parser()
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * */
  componentDidMount () {
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
    if (this.mapBoxGL &&
      this.mapBoxGL.flyTo) this.mapBoxGL.flyTo(lon, lat)
    if (this.leaflet &&
      this.leaflet.flyTo) this.leaflet.flyTo(lon, lat)
    return [lon, lat]
  }

  /* * * * * * * * * * * * * * * *
   *
   * ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  zoomTo (z) {
    if (this.mapBoxGL &&
      this.mapBoxGL.zoomTo) this.mapBoxGL.zoomTo(z)
    if (this.leaflet &&
      this.leaflet.zoomTo) this.leaflet.zoomTo(z)
    return z
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY AND ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  flyAndZoomTo (lon, lat, z) {
    if (this.mapBoxGL &&
      this.mapBoxGL.flyAndZoomTo) this.mapBoxGL.flyAndZoomTo(lon, lat, z)
    if (this.leaflet &&
      this.leaflet.flyAndZoomTo) this.leaflet.flyAndZoomTo(lon, lat, z)
    return {
      center: [lon, lat],
      zoom: z
    }
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props, state } = this
    // const { webgl } = state
    const webgl = false
    const {
      pageIsReady,   places,         activeFilter,
      activePlaceId, activatePlace,  unactivatePlace,
      mapboxToken,   vectorMapStyle, maxBounds,
      initCenter,    initZoom,       minZoom,
      rasterTiles,   rasterAttribution
    } = props

    // Mapbox children
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

    // Leaflet children
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
        ? <MapBoxGL token={mapboxToken}
          ref={n => this.mapBoxGL = n}
          minZoom={minZoom}
          maxBounds={maxBounds}
          mapStyle={vectorMapStyle}
          initCenter={initCenter}
          initZoom={initZoom}>
          {mapboxChildren}
        </MapBoxGL>
        : <LeafletMap rasterTiles={rasterTiles}
          rasterAttribution={rasterAttribution}
          ref={n => this.leaflet = n}
          minZoom={minZoom}
          maxBounds={maxBounds}
          initCenter={initCenter}
          initZoom={initZoom}>
          {leafletChildren}
        </LeafletMap>
    }</div>
  }
}
