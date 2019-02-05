import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import Slug from 'libe-components/lib/text-levels/Slug'
import SectionTitle from 'libe-components/lib/text-levels/SectionTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'

export default class ParisPopCard extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.h2r = new Parser()
  }

  render () {
    const { props, c, h2r } = this
    const { unactivatePlace, place } = props
    console.log(place)
    if (!place) return <div className={`${c}__card`} />

    // const photo = place.photo ? place.photo : null
    const photo = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Barricades_rue_Saint-Maur._Avant_l%27attaque%2C_25_juin_1848._Apr%C3%A8s_l%E2%80%99attaque%2C_26_juin_1848.jpg'

    return <div className={`${c}__card`}>
      <button className={`${c}__card-close`}
        onClick={unactivatePlace} />
      <div className={`${c}__card-illustration`}>
        {photo ? <img src={photo} /> : ''}
      </div>
      <div className={`${c}__card-slug`}>
        <Slug big>{place.address}</Slug>
      </div>
      <div className={`${c}__card-title`}>
        <SectionTitle level={2}>{h2r.parse(place.name)}</SectionTitle>
      </div>
      <div className={`${c}__card-share`}>
        Share card !
      </div>
      <div className={`${c}__card-content`}>
        <Paragraph>{h2r.parse(place.text)}</Paragraph>
      </div>
      <ul>
        <li>Sources</li>
        <li>Read also</li>
        <li>Share</li>
        <li>Signature</li>
      </ul>
    </div>
  }
}
