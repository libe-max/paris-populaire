import React, { Component } from 'react'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'

export default class FiltersBlock extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
  }

  render () {
    const { c, props } = this
    const { isActive, activeFilter, filters, toggleFiltersPanel, setFilter } = props
    const activeFilterWithData = activeFilter
      ? filters.filter(filter => {
        return filter.type === activeFilter.type
      })[0]
      : null
    const activeFilterDisplayName = activeFilterWithData
      ? activeFilterWithData.data.filter(option => {
        return activeFilter.value === option.id
      })[0].name
      : null

    const classes = [`${c}__filters-block`]
    if (isActive) classes.push(`${c}__filters-block_active`)
    if (activeFilterDisplayName) classes.push(`${c}__filters-block_with-filter`)

    return <div className={classes.join(' ')}
      ref={n => this.$root = n}>
      <div className={`${c}__filters-block-head`}
        onClick={() => toggleFiltersPanel(!isActive)}>
        <div className={`${c}__filters-block-title`}>
          <BlockTitle>Filtrer</BlockTitle>
        </div>
        <div className={`${c}__filters-block-active-filter`}>
          <BlockTitle>
            <span>Filtré sur : </span>
            <span>{activeFilterDisplayName}</span>
            <button onClick={e => {
              e.stopPropagation()
              setFilter(null)
            }}>X</button>
          </BlockTitle>
        </div>
      </div>
      <div className={`${c}__filters-list`}>{
        filters.map((filter, i) => {
          return <div key={i}
            className={`${c}__filter`}>
            <Paragraph>{filter.label}</Paragraph>
            <select defaultValue='placeholder'
              data-type={filter.type}
              onChange={e => setFilter(
                filter.type,
                e.target.value
              )}>{[
              <option disabled
                key={-1}
                value='placeholder'>
                Choisir...
              </option>,
              ...filter.data.map((opt, j) => {
                return <option key={j}
                  value={opt.id}>
                  {opt.name}
                </option>
              })]
            }</select>
          </div>
        })
      }</div>
    </div>
  }
}
