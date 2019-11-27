import React, { Component } from 'react'
import 'whatwg-fetch'
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

import './custom.css'

export default class ParisPopulaire extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = 'parispop' // Prefix for all css classes (BEM method)
    /* eslint-disable no-multi-spaces */
    this.state = {
      page: 'map',         // 'intro' || 'map' || 'filters' || 'cards'
      suggest_intro: false,  // <Boolean>
      loading: true,         // <Boolean>
      error: null,           // null || <Error>
      data: null,            // null || <Object>
      active_place_id: null, // null || <Number>
      active_filter: null    // null || <Object>
    }
    /* eslint-enable no-multi-spaces */
    this.fetchData = this.fetchData.bind(this)
    this.toggleFiltersPanel = this.toggleFiltersPanel.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.toggleIntro = this.toggleIntro.bind(this)
    this.suggestIntro = this.suggestIntro.bind(this)
    this.interpretUrlQuery = this.interpretUrlQuery.bind(this)
    this.activatePlace = this.activatePlace.bind(this)
    this.unactivatePlace = this.unactivatePlace.bind(this)
    this.positionMap = this.positionMap.bind(this)

    // [WIP] Pre-load data
    this.fetchData().catch(err => {
      console.error(err)
      this.setState({
        loading: false,
        error: err
      })
    }).then(r => {
      const ret = enrichData(r)
      const interpretedState = this.interpretUrlQuery(window.location.search, ret)
      const { parisPopMap } = this
      const { page, active_place_id: activePlaceId } = interpretedState
      if (parisPopMap && page === 'intro') parisPopMap.shiftCenterAndZoom()
      else if (parisPopMap && page === 'map') parisPopMap.resetCenterAndZoom()
      else if (parisPopMap && page === 'cards') {
        const place = ret.places.find(place => place.id === activePlaceId)
        parisPopMap.flyAndZoomTo(place.longitude + 0.00216, place.latitude, 17)
      }
      const newState = {
        ...interpretedState,
        data: ret,
        loading: false,
        error: null
      }
      this.setState(newState, this.positionMap)
    }).catch(e => {
      console.error(e)
      this.setState({
        loading: false,
        error: e
      })
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * FETCH DATA
   *
   * * * * * * * * * * * * * * * */
  async fetchData () {
    const {
      dev_spreadsheet: devSpreadsheet,
      prod_spreadsheet: prodSpreadsheet
    } = this.props
    const { pathname } = window.location
    const isProd = pathname.match(/\/apps\/maxime\/restos\/?/)
    const spreadsheetToFetch = isProd ? prodSpreadsheet : devSpreadsheet
    console.log(isProd ? 'prod' : 'dev')
    const res = await window.fetch(spreadsheetToFetch)
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
    /* URL Params :
     *   - a : active_place_id
     *   - b : active_filter_type
     *   - c : active_filter_value
     *   - d : page */

    let decodedSearch = ''
    try { decodedSearch = window.atob(search.slice(1)) } catch (e) { console.warn('Wrong url query') }
    const query = qs.parse(decodedSearch)
    const rawPage = query.d
    const rawActivePlace = parseInt(query.a, 10) || null
    const rawActiveFilterType = query.b
    const rawActiveFilterValue = query.c

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

    const page = activePlace
      ? 'cards'
      : (rawPage === 'intro' ||
      rawPage === 'map' ||
      rawPage === 'filters')
        ? rawPage
        : null

    // [WIP] re-work this using this.activatePlace
    // and this.activateFiltersPanel
    const ret = {}
    if (activeFilter) ret.active_filter = activeFilter
    if (activePlace) {
      ret.active_place_id = activePlace
      ret.page = 'cards'
    } else if (page) ret.page = page
    if (search) {
      window.history.pushState(
        {},
        document.title,
        window.location.href.replace(search, '')
      )
    }
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
    if (a && this.parisPopMap) this.parisPopMap.shiftCenterAndZoom()
    if (!a && this.parisPopMap) this.parisPopMap.resetCenterAndZoom()
    return this.setState({ page: 'map' })
  }

  /* * * * * * * * * * * * * * * *
   *
   * SUGGEST INTRO
   *
   * * * * * * * * * * * * * * * */
  suggestIntro (a) {
    if (typeof a !== 'boolean') return
    const {
      page,
      suggest_intro: suggestIntro
    } = this.state
    if (a && page === 'intro') return
    if (a && suggestIntro) return
    else if (!a && !suggestIntro) return
    return this.setState({ suggest_intro: false })
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
    // const typeExists = ['notions', 'periods', 'persons', 'chapters', 'areas', 'place_types'].indexOf(type) > -1
    const typeExists = ['periods', 'chapters', 'place_types'].indexOf(type) > -1
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
      this.unactivatePlace({
        stay_here: true
      })
      return window.setTimeout(() => {
        if (this.parisPopMap) {
          this.parisPopMap.flyAndZoomTo(
            place.longitude + 0.00216,
            place.latitude,
            17
          )
        }
        this.setState(newState)
      }, 200)
    }
    if (this.parisPopMap) {
      this.parisPopMap.flyAndZoomTo(
        place.longitude + 0.00216,
        place.latitude,
        17
      )
    }
    return this.setState(newState)
  }

  /* * * * * * * * * * * * * * * *
   *
   * UNACTIVATE PLACE
   *
   * * * * * * * * * * * * * * * */
  unactivatePlace (options = {}) {
    const { parisPopMap } = this
    if (parisPopMap && !options.stay_here) {
      if (window.innerWidth <= 1008) parisPopMap.zoomTo(13.7)
      else parisPopMap.zoomTo(15.5)
    }
    return this.setState({
      page: 'map',
      active_place_id: null
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * POSITION MAP
   *
   * * * * * * * * * * * * * * * */
  positionMap () {
    if (!this.parisPopMap) return
    const { page } = this.state
    if (page === 'intro') this.parisPopMap.shiftCenterAndZoom()
    else if (page === 'map') this.parisPopMap.resetCenterAndZoom()
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
      ? [...data.places].filter(p => p.id === activePlaceId)[0]
      : null
    const { prevPlace, nextPlace } = (() => {
      if (!activePlace) return {}
      const activePlacePos = data.places.findIndex(place => place.id === activePlaceId)
      const prevPlacePos = activePlacePos !== 0 ? activePlacePos - 1 : data.places.length - 1
      const nextPlacePos = activePlacePos !== data.places.length - 1 ? activePlacePos + 1 : 0
      return { prevPlace: data.places[prevPlacePos], nextPlace: data.places[nextPlacePos] }
    })()
    
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
          ref={n => { this.parisPopMap = n }}
          appRootClass={c}
          pageIsReady={pageIsReady}
          activatePlace={this.activatePlace}
          unactivatePlace={this.unactivatePlace}
          activePlaceId={activePlaceId}
          places={data ? data.places : []} />
      </div>
      <div className={`${c}__filters-panel`}>
        <ParisPopFiltersBlock activeFilter={state.active_filter}
          isActive={state.page === 'filters'}
          toggleFiltersPanel={this.toggleFiltersPanel}
          ref={n => { this.filtersBlock = n }}
          setFilter={this.setFilter}
          appRootClass={c}
          filters={[
            /* { type: 'notions', label: 'Notions', data: data ? data.notions || [] : [] }, */
            { type: 'chapters', label: 'Budget', data: data ? data.chapters || [] : [] },
            /* { type: 'areas', label: 'Zones géographiques', data: data ? data.areas || [] : [] }, */
            // { type: 'periods', label: 'Périodes', data: data ? data.periods || [] : [] },
            /* { type: 'persons', label: 'Personages', data: data ? data.persons || [] : [] }, */
            { type: 'place_types', label: 'Type de restaurant', data: data ? data.place_types || [] : [] }
          ]} />
      </div>
      <div className={`${c}__intro-overlay`} onClick={() => this.toggleIntro(false)} />
      <div className={`${c}__cards-overlay`} onClick={this.unactivatePlace} />
      <div className={`${c}__intro-panel-triggerer`}
        onMouseOver={() => this.suggestIntro(true)}
        onMouseOut={() => this.suggestIntro(false)} />
      <div className={`${c}__app-logo`}
        onMouseOver={() => this.suggestIntro(true)}
        onMouseOut={() => this.suggestIntro(false)}
        onClick={() => this.toggleIntro(true)}>
        <PageTitle small>
          <span>On a faim.</span>
        </PageTitle>
      </div>
      <div className={`${c}__intro-panel`}
        onMouseOver={() => this.suggestIntro(true)}
        onMouseOut={() => this.suggestIntro(false)}
        onClick={() => this.toggleIntro(true)}>
        <ParisPopIntro appRootClass={c}
          texts={data ? data.intro : []}
          credits={data ? data.credits : []}
          closeIntro={() => this.toggleIntro(false)} />
      </div>
      <div className={`${c}__cards-panel`}>
        <ParisPopCard place={activePlace}
          activatePlace={this.activatePlace}
          unactivatePlace={this.unactivatePlace}
          prevPlace={prevPlace}
          nextPlace={nextPlace}
          setFilter={this.setFilter}
          appRootClass={c} />
      </div>
    </div>
  }
}
