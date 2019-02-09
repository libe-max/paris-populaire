import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import getParent from 'libe-utils/get-closest-dom-parent'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import Slug from 'libe-components/lib/text-levels/Slug'
import SectionTitle from 'libe-components/lib/text-levels/SectionTitle'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class ParisPopCard extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.state = { active_source_id: null }
    this.h2r = new Parser()
    this.handleClicksInCard = this.handleClicksInCard.bind(this)
    this.activateSource = this.activateSource.bind(this)
  }

  componentDidMount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  componentWillUnmount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  componentDidUpdate (prevProps) {
    const prevPlace = prevProps.place || {}
    const place = this.props.place || {}
    if (place.id !== prevPlace.id) this.setState({ active_source_id: null })
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
      const value = isArea.getAttribute('data-place')
      return this.props.setFilter(type, value)
    } else if (isNotion) {
      const type = 'notions'
      const value = isNotion.getAttribute('data-notion')
      return this.props.setFilter(type, value)
    } else if (isLink) {
      const id = parseInt(isLink.getAttribute('data-link'), 10)
      return this.props.activatePlace(id, { smooth: true })
    } else if (isSource) {
      const sourceId = parseInt(isSource.getAttribute('data-source'), 10) - 1
      return this.activateSource(sourceId)
    }
    return
  }

  activateSource (id) {
    const { props, $root } = this
    const { _display_sources: sources } = props.place
    if (typeof id !== 'number' ||
      id >= sources.length ||
      id < 0) return
    $root.parentNode.scrollTop = $root.clientHeight
    return this.setState({ active_source_id: id })
  }

  render () {
    const { props, state, c, h2r } = this
    const { unactivatePlace, place } = props
    const { active_source_id: activeSourceId } = state
    if (!place) return <div className={`${c}__card`} ref={n => this.$root = n} />

    const photo = place.photo
      ? 'https://upload.wikimedia.org/wikipedia/commons/2/26/Barricades_rue_Saint-Maur._Avant_l%27attaque%2C_25_juin_1848._Apr%C3%A8s_l%E2%80%99attaque%2C_26_juin_1848.jpg'
      : null
    const {
      id, address, name,
      text, author, long_read,
      long_read_intro,
      _display_text: displayText,
      _display_sources: displaySources
    } = place
    const { origin, pathname } = window.location
    const tweetUrl = origin + pathname + `?active_place_id=${id}`

    return <div className={`${c}__card`} ref={n => this.$root = n}>
      <button className={`${c}__card-close`} onClick={unactivatePlace} />
      <div className={`${c}__card-illustration`}>{photo ? <img src={photo} /> : ''}</div>
      <div className={`${c}__card-slug`}><Slug big>{address}</Slug></div>
      <div className={`${c}__card-title`}><SectionTitle level={2}>{h2r.parse(name)}</SectionTitle></div>
      <div className={`${c}__card-content`}><Paragraph>{h2r.parse(displayText.innerHTML)}</Paragraph></div>
      <div className={`${c}__card-signature`}><Paragraph>{author}</Paragraph></div>
      <div className={`${c}__card-share`}>
        <BlockTitle level={4}>Partager</BlockTitle>
        <ShareArticle short
          iconsOnly
          url={tweetUrl}
          tweetText={`Vous connaissez l'histoire de ${name} ?`}
          tweetVia='@libe, @Libe_Labo' />
      </div>
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
          const activeClass = (i === activeSourceId)
            ? ` ${c}__card-source_active`
            : ''
          return <div key={i}
            id={`${c}__card-source-${i}`}
            className={`${c}__card-source${activeClass}`}>
            <Annotation literary>
              {`(${i + 1})`} {h2r.parse(s)}
            </Annotation>
          </div>
        })}
      </div>
    </div>
  }
}
