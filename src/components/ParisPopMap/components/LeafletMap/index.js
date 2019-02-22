import React, { Component } from 'react'
import { Map as Leaflet, TileLayer } from 'react-leaflet'

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
        center: [props.initCenter[1], props.initCenter[0] + 0.00216],
        zoom: props.initZoom,
        maxBounds: props.maxBounds.map(bound => bound.reverse()),
        minZoom: props.minZoom,
        rasterTiles: props.rasterTiles,
        rasterAttribution: props.rasterAttribution
      }
    }
    this.flyTo = this.flyTo.bind(this)
    this.zoomTo = this.zoomTo.bind(this)
    this.flyAndZoomTo = this.flyAndZoomTo.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY TO
   *
   * * * * * * * * * * * * * * * */
  flyTo (lon, lat) {
    const { node } = this
    if (!node ||
      !node.leafletElement ||
      !node.leafletElement.flyTo) return
    node.leafletElement.flyTo([lat, lon + 0.00216])
  }

  /* * * * * * * * * * * * * * * *
   *
   * ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  zoomTo (z) {
    const { node } = this
    if (!node ||
      !node.leafletElement ||
      !node.leafletElement.setZoom) return
    node.leafletElement.setZoom(z)
  }

  /* * * * * * * * * * * * * * * *
   *
   * FLY AND ZOOM TO
   *
   * * * * * * * * * * * * * * * */
  flyAndZoomTo (lon, lat, z) {
    const { node } = this
    if (!node ||
      !node.leafletElement ||
      !node.leafletElement.setView) return
    node.leafletElement.setView([lat, lon + 0.00216], z)
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
      minZoom={map.minZoom}
      ref={n => { this.node = n }}>
      <TileLayer
        url={map.rasterTiles}
        attribution={map.rasterAttribution} />
      {children}
    </Leaflet>
  }
}
