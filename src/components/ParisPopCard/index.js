import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import getParent from 'libe-utils/get-closest-dom-parent'
import Svg from 'libe-components/lib/primitives/Svg'
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
    if (isSource) {
      const sourceId = parseInt(isSource.getAttribute('data-source'), 10) - 1
      return this.activateSource(sourceId)
    } else if (isPerson) {
      // const type = 'persons'
      // const value = isPerson.getAttribute('data-person')
      // return this.props.setFilter(type, value)
    } else if (isArea) {
      // const type = 'areas'
      // const value = isArea.getAttribute('data-place')
      // return this.props.setFilter(type, value)
    } else if (isNotion) {
      // const type = 'notions'
      // const value = isNotion.getAttribute('data-notion')
      // return this.props.setFilter(type, value)
    } else if (isLink) {
      const id = parseInt(isLink.getAttribute('data-link'), 10)
      return this.props.activatePlace(id, { smooth: true })
    }
  }

  activateSource (id) {
    const { props, $root } = this
    const { _display_sources: sources } = props.place
    if (typeof id !== 'number' ||
      id >= sources.length ||
      id < 0) return
    const source = $root.querySelectorAll('.parispop__card-source')[id]
    if (source) {
      source.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    return this.setState({ active_source_id: id })
  }

  render () {
    const { props, state, c, h2r } = this
    const { unactivatePlace, place } = props
    const { active_source_id: activeSourceId } = state
    if (!place) return <div className={`${c}__card`} ref={n => { this.$root = n }} />

    const {
      id, address, name,
      author, photo, photo_credits: photoCredits,
      long_read: longRead, long_read_intro: longReadIntro,
      _display_text: displayText,
      _display_sources: displaySources
    } = place
    const { origin, pathname } = window.location
    const tweetUrl = origin + pathname + `?` + window.btoa(`a=${id}`)

    return <div className={`${c}__card`} ref={n => { this.$root = n }}>
      <div className={`${c}__card-actions`}>
        {/* <button className={`${c}__card-prev ${c}__card-prev_${prevPlace ? 'active' : 'inactive'}`}
          onClick={prevPlace ? () => activatePlace(prevPlace, { smooth: true }) : null}>
          <Svg src='https://www.liberation.fr/apps/static/assets/left-arrow-head-icon_40.svg' />
        </button>
        <button className={`${c}__card-next ${c}__card-next_${nextPlace ? 'active' : 'inactive'}`}
          onClick={nextPlace ? () => activatePlace(nextPlace, { smooth: true }) : null}>
          <Svg src='https://www.liberation.fr/apps/static/assets/right-arrow-head-icon_40.svg' />
        </button> */}
        <button className={`${c}__card-close`} onClick={unactivatePlace}>
          <Svg src='https://www.liberation.fr/apps/static/assets/tilted-cross-icon_40.svg' />
        </button>
      </div>
      <div className={`${c}__card-illustration`}>{photo ? <img src={photo} alt={photoCredits} /> : ''}</div>
      <div className={`${c}__card-illustration-credits`}>{photoCredits ? <Annotation>{photoCredits}</Annotation> : ''}</div>
      <div className={`${c}__card-slug`}><Slug big>{address}</Slug></div>
      <div className={`${c}__card-title`}><SectionTitle level={2}>{h2r.parse(name)}</SectionTitle></div>
      <div className={`${c}__card-content`}><Paragraph>{h2r.parse(displayText.innerHTML)}</Paragraph></div>
      <div className={`${c}__card-signature`}><Paragraph>{h2r.parse(author)}</Paragraph></div>
      <div className={`${c}__card-share`}>
        <BlockTitle level={4}>Partager</BlockTitle>
        <ShareArticle short iconsOnly url={tweetUrl} />
      </div>
      {longRead
        ? <div className={`${c}__card-read-also`}>
          <BlockTitle level={4}>À lire aussi</BlockTitle>
          <Paragraph><a href={longRead}>{h2r.parse(longReadIntro) || longRead}</a></Paragraph>
        </div>
        : ''
      }
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
