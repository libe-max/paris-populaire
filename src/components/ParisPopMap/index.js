import React, { Component } from 'react'
import { Layer, Feature } from 'react-mapbox-gl'
import MapBoxGL from './components/MapBoxGL'
import LeafletMap from './components/LeafletMap'

import token from '../../.mapbox-token'
import { FEAimg, FNAimg, UEAimg, UNAimg } from './mapbox-markers'
// import mapStyle from './map-style.json'

const mapStyle = 'mapbox://styles/libe-max/cjrj00aqu6ydy2snu1lf36lgi'
const maxBounds = [[1.852, 48.615], [2.816, 49.102]]
const initCenter = [2.334, 48.856]
const initZoom = [11.5]
const minZoom = 10

export default class ParisPopMap extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass

    // Detect WebGLRenderingContext
    const canvas = document.createElement('canvas')
    const webGl = canvas.getContext('webgl')
    const expWebGl = canvas.getContext('experimental-webgl')
    if (webGl || expWebGl) this.webgl = true
    else this.webgl = false
  }

  render () {
    const { c, props, state, webgl } = this
    const { pageIsReady, places, activeFilter, activePlaceId } = props

    // Split places into different categories, corresponding
    // to different layers rendered on the map.
    // There are 8 possible categories since there are 3
    // parameters with 2 options each (2^3), which are:
    //   - In filter (F) / Out of filter (U)
    //   - Existing (E) / Not existing (N)
    //   - Active (A) / Inactive (I)
    // Each place will be tagged by a 3 letters tag
    // describing the category (FEA, FNI, UEA, etc, ...)

    const sortedPlaces = {
      FEA: [], FEI: [], FNA: [], FNI: [], UEA: [],
      UEI: [], UNA: [], UNI: [], none: []
    }

    places.forEach(place => {
      let category = ''
      // In filter (F) / Out of filter (U)
      if (!activeFilter) category += 'F'
      else if (place[`_${activeFilter.type}`].indexOf(activeFilter.value) > -1) category += 'F'
      else category += 'U'
      // Existing (E) / Not existing (N)
      if (place.exists) category += 'E'
      else category += 'N'
      // Active (A) / Inactive (I)
      if (place.id === activePlaceId) category += 'A'
      else category += 'I'

      if (!sortedPlaces[category]) sortedPlaces.none.push(place)
      else sortedPlaces[category].push(place)
    })

    const layers = [
      // In filter, existing, active
      <Layer type="symbol"
        id="fea"
        images={FEAimg}
        layout={{ 'icon-image': 'FEA' }}>{
        sortedPlaces.FEA.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // In filter, existing, inactive
      <Layer type="symbol"
        id="fei"images={FEAimg}
        layout={{ 'icon-image': 'FEA' }}>{
        sortedPlaces.FEI.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // In filter, not existing, active
      <Layer type="symbol"
        id="fna"images={FNAimg}
        layout={{ 'icon-image': 'FNA' }}>{
        sortedPlaces.FNA.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // In filter, not existing, inactive
      <Layer type="symbol"
        id="fni"
        images={FNAimg}
        layout={{ 'icon-image': 'FNA' }}>{
        sortedPlaces.FNI.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // Not in filter, existing, active
      <Layer type="symbol"
        id="uea"
        images={UEAimg}
        layout={{ 'icon-image': 'UEA' }}>{
        sortedPlaces.UEA.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // Not in filter, existing, inactive
      <Layer type="symbol"
        id="uei"
        images={UEAimg}
        layout={{ 'icon-image': 'UEA' }}>{
        sortedPlaces.UEI.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // Not in filter, not existing, active
      <Layer type="symbol"
        id="una"
        images={UNAimg}
        layout={{ 'icon-image': 'UNA' }}>{
        sortedPlaces.UNA.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>,
      // Not in filter, not existing, inactive
      <Layer type="symbol"
        id="uni"
        images={UNAimg}
        layout={{ 'icon-image': 'UNA' }}>{
        sortedPlaces.UNI.map(place => {
          return <Feature key={place.id}
            coordinates={[
              place.longitude,
              place.latitude
            ]} />
        })
      }</Layer>
    ]

    if (!pageIsReady) return <div />
    return <div className={`${c}__map`}>{
      webgl
        ? <MapBoxGL layers={layers}
          token={token}
          minZoom={minZoom}
          maxBounds={maxBounds}
          mapStyle={mapStyle}
          initCenter={initCenter}
          initZoom={initZoom} />
        : <LeafletMap places={places} />
    }</div>
  }
}
