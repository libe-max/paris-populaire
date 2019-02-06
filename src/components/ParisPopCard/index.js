import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import getParent from 'libe-utils/get-closest-dom-parent'
import Slug from 'libe-components/lib/text-levels/Slug'
import SectionTitle from 'libe-components/lib/text-levels/SectionTitle'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class ParisPopCard extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.h2r = new Parser()
    this.handleClicksInCard = this.handleClicksInCard.bind(this)
  }

  componentDidMount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  componentWillUnmount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  handleClicksInCard (e) {
    const isPerson = getParent(e.target, 'span[data-person]')
    const isArea = getParent(e.target, 'span[data-place]')
    const isNotion = getParent(e.target, 'span[data-notion]')
    const isLink = getParent(e.target, 'span[data-link]')
    const isSource = getParent(e.target, 'span[data-source]')
    if (!isPerson && !isArea && !isNotion && !isLink && !isSource) return
    if (isPerson) {
      const type = 'persons'
      const value = isPerson.getAttribute('data-person')
      return this.props.setFilter(type, value)
    } else if (isArea) {
      const type = 'areas'
      const value = isPerson.getAttribute('data-place')
      return this.props.setFilter(type, value)
    } else if (isNotion) {
      const type = 'notions'
      const value = isPerson.getAttribute('data-notion')
      return this.props.setFilter(type, value)
    } else if (isNotion) {
      const type = 'notions'
      const value = isPerson.getAttribute('data-notion')
      return this.props.setFilter(type, value)
    } else if (isLink) {
      const id = parseInt(isLink.getAttribute('data-link'), 10)
      return this.props.activatePlace(id, { smooth: true })
    } else if (isSource) {
      // Work here !
    }
    return
  }

  render () {
    const { props, c, h2r } = this
    const { unactivatePlace, place } = props
    if (!place) return <div className={`${c}__card`} ref={n => this.$root = n} />

    const photo = place.photo
      ? 'https://upload.wikimedia.org/wikipedia/commons/2/26/Barricades_rue_Saint-Maur._Avant_l%27attaque%2C_25_juin_1848._Apr%C3%A8s_l%E2%80%99attaque%2C_26_juin_1848.jpg'
      : null
    const {
      address,
      name,
      text,
      author,
      long_read,
      long_read_intro,
      _display_text: displayText,
      _display_sources: displaySources
    } = place

    return <div className={`${c}__card`} ref={n => this.$root = n}>
      <button className={`${c}__card-close`} onClick={unactivatePlace} />
      <div className={`${c}__card-illustration`}>{photo ? <img src={photo} /> : ''}</div>
      <div className={`${c}__card-slug`}><Slug big>{address}</Slug></div>
      <div className={`${c}__card-title`}><SectionTitle level={2}>{h2r.parse(name)}</SectionTitle></div>
      <div className={`${c}__card-share`}>Share card !</div>
      <div className={`${c}__card-content`}><Paragraph>{h2r.parse(displayText.innerHTML)}</Paragraph></div>
      <div className={`${c}__card-signature`}><Paragraph>{author}</Paragraph></div>
      <div className={`${c}__card-read-also`}>{long_read
        ? <div>
          <BlockTitle level={4}>À lire aussi</BlockTitle>
          <Paragraph><a href={long_read}>{h2r.parse(long_read_intro) || long_read}</a></Paragraph>
        </div>
        : ''
      }</div>
      <div className={`${c}__card-sources`}>
        <BlockTitle level={4}>Sources</BlockTitle>
        {displaySources.map((s, i) => {
          return <div key={i}
            className={`${c}__card-source`}>
            <Annotation literary>
              {`(${i + 1})`} {h2r.parse(s)}
            </Annotation>
          </div>
        })}
      </div>
      <div className={`${c}__card-share`}>Share card !</div>
    </div>
  }
}
