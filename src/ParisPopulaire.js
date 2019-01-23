import React, { Component } from 'react'
import qs from 'querystring'
import { parseTsvWithTabs } from 'libe-utils/parse-tsv'
import parseTsvParams from './utils/parse-tsv-params.js'
import enrichData from './utils/enrich-data.js'

import LibeLoader from './components/Loader'
import LibeLoadingError from './components/DataLoadingError'

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
    this.c = 'parispop'
    this.state = {
      page: 'intro',       // 'intro' || 'map' || 'filters'
      loading: true,       // <Boolean>
      error: null,         // null || <Error>
      data: null,          // null || <Array>
      active_place: null,  // null || <Number>
      active_filter: null  // null || <Object>
    }
    this.fetchData = this.fetchData.bind(this)
    this.interpretUrlQuery = this.interpretUrlQuery.bind(this)
    this.fetchData().catch(err => {
      this.setState({
        loading: false,
        error: err
      })
    }).then(r => {
      const ret = enrichData(r)
      const interpretedState = this.interpretUrlQuery(window.location.search, ret)
      const newState = {
        ...interpretedState,
        data: ret,
        loading: false,
        error: null
      }
      this.setState(newState)
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
    const rawActivePlace = parseInt(query.active_place, 10) || null
    const rawActiveFilterType = query.active_filter_type
    const rawActiveFilterValue = query.active_filter_value

    const page = (rawPage === 'intro' ||
      rawPage === 'map' ||
      rawPage === 'filters')
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
    
    const ret = {}
    if (activePlace) ret.active_place = activePlace
    if (activeFilter) ret.active_filter = activeFilter
    if (activeFilter) ret.page = 'filters'
    else if (activePlace) ret.page = 'map'
    else if (page) ret.page = page
    return ret
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { props, state, c } = this

    const classes = [c, `${c}_${state.page}-page`]
    // classes.push(`${c}_loading`)
    if (state.loading) classes.push(`${c}_loading`)
    if (state.error) classes.push(`${c}_error`)

    return <div className={classes.join(' ')}>
      <div className={`${c}__loading`}><LibeLoader /></div>
      <div className={`${c}__error`}><LibeLoadingError /></div>
      <div className={`${c}__map`}>Map component</div>
      <div className={`${c}__caption`}>Légende</div>
      <div className={`${c}__filters`}>Filters</div>
      <div className={`${c}__intro`}>Intro</div>
      <div className={`${c}__cards`}>Fiches</div>
    </div>
  }
}
