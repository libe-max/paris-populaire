import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
// import { Map } from 'mapboxgl'

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibGliZS1tYXgiLCJhIjoiY2pvaDBwMDV3MGVvNDN3b2EwaXZjNTh5ZiJ9.OAddWXBWmbQk1-mgBWyQLA'
})

export default class ParisPopMap extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
  }

  // componentDidMount () {
  //   this.map = ReactMapboxGl({
  //     accessToken: 'pk.eyJ1IjoibGliZS1tYXgiLCJhIjoiY2pvaDBwMDV3MGVvNDN3b2EwaXZjNTh5ZiJ9.OAddWXBWmbQk1-mgBWyQLA'
  //   })
  // }

  render () {
    const { c, props } = this
    const { activeFilter, places } = props

    return <div className={`${c}__map`}>
      <Map style="mapbox://styles/libe-max/cjrc8rpio05t12so4tkgnlzf1"
        containerStyle={{ height: '100vh', width: '100vw' }}>
          <Layer type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
      </Map>
    </div>
  }
}
