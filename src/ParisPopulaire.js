import React, { Component } from 'react'
import qs from 'querystring'
import { parseTsvWithTabs } from 'libe-utils/parse-tsv'
import parseTsvParams from './utils/parse-tsv-params.js'
import enrichData from './utils/enrich-data.js'

import LibeLoader from './components/Loader'
import LibeLoadingError from './components/DataLoadingError'
import ParisPopFiltersBlock from './components/ParisPopFiltersBlock'
import ParisPopMap from './components/ParisPopMap'
import ParisPopCard from './components/ParisPopCard'
import ParisPopCaption from './components/ParisPopCaption'
import ParisPopIntro from './components/ParisPopIntro'

import PageTitle from 'libe-components/lib/text-levels/PageTitle'
import InterTitle from 'libe-components/lib/text-levels/InterTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'

/* [WIP] host this file in libe-static-ressources once the work is done */
import './parispop.css'

export default class ParisPopulaire extends Component {
  
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = 'parispop'      // Prefix for all css classes (BEM method)
    this.state = {
      page: 'intro',         // 'intro' || 'map' || 'filters' || 'cards'
      suggest_intro: false,  // <Boolean>
      loading: true,         // <Boolean>
      error: null,           // null || <Error>
      data: null,            // null || <Object>
      active_place_id: null, // null || <Number>
      active_filter: null    // null || <Object>
    }
    this.fetchData = this.fetchData.bind(this)
    this.toggleFiltersPanel = this.toggleFiltersPanel.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.toggleIntro = this.toggleIntro.bind(this)
    this.suggestIntro = this.suggestIntro.bind(this)
    this.interpretUrlQuery = this.interpretUrlQuery.bind(this)
    this.activatePlace = this.activatePlace.bind(this)
    this.unactivatePlace = this.unactivatePlace.bind(this)

    // [WIP] Pre-load data
    this.fetchData().catch(err => {
      this.setState({
        loading: false,
        error: err
      })
    }).then(r => {
      const ret = enrichData(r)
      const interpretedState = this.interpretUrlQuery(window.location.search, ret)
      this.setState({
        ...interpretedState,
        data: ret,
        loading: false,
        error: null
      })
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * FETCH DATA
   *
   * * * * * * * * * * * * * * * */
  async fetchData () {
    const { spreadsheet } = this.props
    const res = await fetch(spreadsheet)
    const status = { res }
    const err = `Server responded with a ${status} error status.`
    if (!res.ok) throw new Error(err)

    const strData = await res.text()
    const data = parseTsvWithTabs({
      tsv: strData,
      tabsParams: parseTsvParams
    })
    return data
  }

  /* * * * * * * * * * * * * * * *
   *
   * INTERPRET URL QUERY
   *
   * * * * * * * * * * * * * * * */
  interpretUrlQuery (search, data) {
    const query = qs.parse(search.slice(1))
    const rawPage = query.page
    const rawActivePlace = parseInt(query.active_place_id, 10) || null
    const rawActiveFilterType = query.active_filter_type
    const rawActiveFilterValue = query.active_filter_value

    const page = (rawPage === 'intro' ||
      rawPage === 'map' ||
      rawPage === 'filters' ||
      rawPage === 'cards')
      ? rawPage
      : null
    const rawActivePlaceExists = data.places
      .some(place => place.id === rawActivePlace)
    const activePlace = rawActivePlaceExists
      ? rawActivePlace
      : null
    const rawActiveFilterTypeExists = data[rawActiveFilterType]
    const rawActiveFilterValueExists = rawActiveFilterTypeExists
      ? data[rawActiveFilterType].some(filter => filter.id === rawActiveFilterValue)
      : false
    const activeFilter = (rawActiveFilterTypeExists &&
      rawActiveFilterValueExists)
      ? {
        type: rawActiveFilterType,
        value: rawActiveFilterValue }
      : null
    
    // [WIP] re-work this using this.activatePlace
    // and this.activateFiltersPanel
    const ret = {}
    if (activeFilter) ret.active_filter = activeFilter
    if (activePlace) {
      ret.active_place_id = activePlace
      ret.page = 'cards'
    }
    else if (page) ret.page = page
    if (search) window.history.pushState(
      {},
      document.title,
      window.location.href.replace(search, '')
    )
    return ret
  }

  /* * * * * * * * * * * * * * * *
   *
   * TOGGLE INTRO
   *
   * * * * * * * * * * * * * * * */
  toggleIntro (a) {
    if (typeof a !== 'boolean') return
    const { page } = this.state
    if (a && page === 'intro') return
    if (!a && page !== 'intro') return
    if (page === 'cards') this.unactivatePlace() // [WIP] not so clean (duplicate setState)
    return this.setState({ page: a ? 'intro' : 'map' })
  }

  /* * * * * * * * * * * * * * * *
   *
   * SUGGEST INTRO
   *
   * * * * * * * * * * * * * * * */
  suggestIntro (a) {
    if (typeof a !== 'boolean') return
    const { suggest_intro: suggestIntro } = this.state
    if (a && suggestIntro) return
    else if (!a && !suggestIntro) return
    return this.setState({ suggest_intro: a })
  }

  /* * * * * * * * * * * * * * * *
   *
   * TOGGLE FILTERS
   *
   * * * * * * * * * * * * * * * */
  toggleFiltersPanel (a) {
    if (typeof a !== 'boolean') return
    const { page } = this.state
    if (a && page === 'filters') return
    if (!a && page !== 'filters') return
    return this.setState({
      page: a ? 'filters' : 'map'
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * SET FILTER
   *
   * * * * * * * * * * * * * * * */
  setFilter (type = null, value) {
    const { state, parisPopMap, filtersBlock } = this
    const { data } = state
    if (!data) return
    const typeExists = [/*'notions',*/ 'periods', /*'persons', 'chapters', 'areas',*/ 'place_types']
      .indexOf(type) > -1
    const valueExists = typeExists ? data[type].some(filter => filter.id === value) : false
    const $selectors = filtersBlock.$root.querySelectorAll('select')
    if (parisPopMap) parisPopMap.resetCenterAndZoom()
    if (typeExists && valueExists) {
      for (let i = 0; i < $selectors.length; i++) {
        const $selector = $selectors[i]
        const selectorType = $selectors[i].getAttribute('data-type')
        if (selectorType !== type) $selector.value = 'placeholder'
      }
      return this.setState({
        page: 'map',
        active_filter: {
          type,
          value
        }
      })
    } else {
      for (let i = 0; i < $selectors.length; i++) {
        const $selector = $selectors[i]
        $selector.value = 'placeholder'
      }
      return this.setState({
        page: 'map',
        active_filter: null
      })
    }
  }

  /* * * * * * * * * * * * * * * *
   *
   * ACTIVATE PLACE
   *
   * * * * * * * * * * * * * * * */
  activatePlace (id, options = {}) {
    const { data, active_place_id: activePlaceId } = this.state
    if (!data) return
    const { places } = data
    const place = places.filter(place => place.id === id)[0]
    if (!place) return
    const newState = {
      page: 'cards',
      active_place_id: id
    }
    if (activePlaceId && options.smooth) {
      this.unactivatePlace()
      return window.setTimeout(() => {
        if (this.parisPopMap) this.parisPopMap.flyAndZoomTo(
          place.longitude + 0.00216,
          place.latitude,
          17
        )
        this.setState(newState)
      }, 200)
    }
    if (this.parisPopMap) this.parisPopMap.flyAndZoomTo(
      place.longitude + 0.00216,
      place.latitude,
      17
    )
    return this.setState(newState)
  }

  /* * * * * * * * * * * * * * * *
   *
   * UNACTIVATE PLACE
   *
   * * * * * * * * * * * * * * * */
  unactivatePlace () {
    const { parisPopMap } = this
    if (parisPopMap) parisPopMap.resetCenterAndZoom()
    return this.setState({
      page: 'map',
      active_place_id: null
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { state, c } = this
    const { data } = state
    const pageIsReady = !state.loading && !state.error
    const activePlaceId = state.active_place_id
    const activePlace = data
      ? data.places.filter(p => p.id === activePlaceId)[0]
      : null

    /* Assign state related classes */
    const classes = [c]
    if (state.loading) classes.push(`${c}_loading`)
    if (state.error) classes.push(`${c}_error`)
    if (pageIsReady && state.page === 'intro') classes.push(`${c}_intro-page`)
    if (pageIsReady && state.page === 'map') classes.push(`${c}_map-page`)
    if (pageIsReady && state.page === 'filters') classes.push(`${c}_filters-page`)
    if (pageIsReady && state.page === 'cards') classes.push(`${c}_cards-page`)
    if (state.page !== 'intro' && state.suggest_intro) classes.push(`${c}_suggest-intro`)

    /* Display component */
    return <div className={classes.join(' ')}>
      <div className={`${c}__loading`}><LibeLoader /></div>
      <div className={`${c}__error`}><LibeLoadingError /></div>
      <div className={`${c}__map-panel`}>
        <ParisPopMap activeFilter={state.active_filter}
          ref={n => this.parisPopMap = n}
          appRootClass={c}
          pageIsReady={pageIsReady}
          activatePlace={this.activatePlace}
          unactivatePlace={this.unactivatePlace}
          activePlaceId={activePlaceId}
          places={data ? data.places : []} />
      </div>
      <div className={`${c}__caption-panel`}>
        <ParisPopCaption appRootClass={c} />
      </div>
      <div className={`${c}__filters-panel`}>
        <ParisPopFiltersBlock activeFilter={state.active_filter}
          isActive={state.page === 'filters'}
          toggleFiltersPanel={this.toggleFiltersPanel}
          ref={n => this.filtersBlock = n}
          setFilter={this.setFilter}
          appRootClass={c}
          filters={[
            /*{ type: 'notions', label: 'Notions', data: data ? data.notions || [] : [] },
            { type: 'chapters', label: 'Chapitres', data: data ? data.chapters || [] : [] },
            { type: 'areas', label: 'Zones géographiques', data: data ? data.areas || [] : [] },*/
            { type: 'periods', label: 'Périodes', data: data ? data.periods || [] : [] },
            /*{ type: 'persons', label: 'Personages', data: data ? data.persons || [] : [] },*/
            { type: 'place_types', label: 'Types de lieux', data: data ? data.place_types || [] : [] }
          ]} />
      </div>
      <div className={`${c}__intro-overlay`} onClick={() => this.toggleIntro(false)} />
      <div className={`${c}__cards-overlay`} onClick={this.unactivatePlace} />
      <div className={`${c}__app-logo`}
        onMouseOver={() => this.suggestIntro(true)}
        onMouseOut={() => this.suggestIntro(false)}
        onClick={() => this.toggleIntro(true)}>
        <PageTitle small>
          <span>Plongée dans le Paris</span>
          <span>Populaire</span>
        </PageTitle>
      </div>
      <div className={`${c}__intro-panel`}>
        <ParisPopIntro appRootClass={c}
          closeIntro={() => this.toggleIntro(false)} />
      </div>
      <div className={`${c}__cards-panel`}>
        <ParisPopCard place={activePlace}
          activatePlace={this.activatePlace}
          unactivatePlace={this.unactivatePlace}
          setFilter={this.setFilter}
          appRootClass={c} />
      </div>
    </div>
  }
}
