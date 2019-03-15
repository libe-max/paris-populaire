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
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.state = { active_source_id: null }
    this.h2r = new Parser()
    this.handleClicksInCard = this.handleClicksInCard.bind(this)
    this.activateSource = this.activateSource.bind(this)
    this.copyLink = this.copyLink.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  /* * * * * * * * * * * * * * * *
   *
   * WILL UNMOUNT
   *
   * * * * * * * * * * * * * * * */
  componentWillUnmount () {
    this.$root.addEventListener('click', this.handleClicksInCard)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID UPDATE
   *
   * * * * * * * * * * * * * * * */
  componentDidUpdate (prevProps) {
    const prevPlace = prevProps.place || {}
    const place = this.props.place || {}
    if (place.id !== prevPlace.id) this.setState({ active_source_id: null })
  }

  /* * * * * * * * * * * * * * * *
   *
   * HANDLE CLICKS IN CARD
   *
   * * * * * * * * * * * * * * * */
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

  /* * * * * * * * * * * * * * * *
   *
   * ACTIVATE SOURCE
   *
   * * * * * * * * * * * * * * * */
  activateSource (id) {
    const { props, $root, c } = this
    const { _display_sources: sources } = props.place
    if (typeof id !== 'number' ||
      id >= sources.length ||
      id < 0) return
    const source = $root.querySelectorAll(`.${c}__card-source`)[id]
    if (source) {
      source.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    return this.setState({ active_source_id: id })
  }

  /* * * * * * * * * * * * * * * *
   *
   * COPY LINK
   *
   * * * * * * * * * * * * * * * */
  copyLink () {
    const { c } = this
    const linkSelector = `.${c}__card-share-hidden-link`
    const buttonSelector = `.${c}__card-share-link`
    const linkContainer = document.querySelector(linkSelector)
    const button = document.querySelector(buttonSelector)
    linkContainer.select()
    document.execCommand('copy')
    if (window.getSelection) window.getSelection().removeAllRanges()
    else if (document.selection) document.selection.empty()
    linkContainer.blur()
    button.innerHTML = '<p class="lblb-paragraph lblb-paragraph_small">Lien copié !</p>'
    return linkContainer.innerHTML
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { props, state, c, h2r } = this
    const { unactivatePlace, place, activatePlace, prevPlace, nextPlace } = props
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
    const tweetText = `${address} ou ailleurs… Parcourez les lieux connus et méconnus du Paris populaire de 1830 à 1980 avec la carte interactive de @Libe, @Libe_Labo.`

    const activatePrevCard = prevPlace ? () => activatePlace(prevPlace.id, { smooth: true }) : null
    const activateNextCard = nextPlace ? () => activatePlace(nextPlace.id, { smooth: true }) : null

    return <div className={`${c}__card`} ref={n => { this.$root = n }}>
      <div className={`${c}__card-actions`}>
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
      <div className={`${c}__card-prev-next`}>
        <BlockTitle>Pour continuer la lecture</BlockTitle>
        <div className={`${c}__card-prev-next-buttons`}>
          <div className={`${c}__prev-card`} onClick={activatePrevCard}>
            <div className={`${c}__card-prev-next-buttons-text`}>
              <Slug>{prevPlace.address}</Slug><br />
              <Paragraph>{prevPlace.name}</Paragraph><br />
            </div>
            <div className={`${c}__card-prev-next-buttons-button`}>
              <Paragraph><a>Lire</a></Paragraph>
            </div>
          </div>
          <div className={`${c}__next-card`} onClick={activateNextCard}>
            <div className={`${c}__card-prev-next-buttons-text`}>
              <Slug>{nextPlace.address}</Slug><br />
              <Paragraph>{nextPlace.name}</Paragraph><br />
            </div>
            <div className={`${c}__card-prev-next-buttons-button`}>
              <Paragraph><a>Lire</a></Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className={`${c}__card-share`}>
        <BlockTitle level={4}>Partager</BlockTitle>
        <ShareArticle short iconsOnly url={tweetUrl} tweetText={tweetText} />
        <div className={`${c}__card-share-link`} onClick={this.copyLink}><Paragraph small><a>Copier le lien</a></Paragraph></div>
        <input className={`${c}__card-share-hidden-link`} type='text' value={tweetUrl} readOnly />
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
          const activeClass = (i === activeSourceId) ? ` ${c}__card-source_active` : ''
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
