import React, { Component } from 'react'
import Svg from 'libe-components/lib/primitives/Svg'
import ParagraphTitle from 'libe-components/lib/text-levels/ParagraphTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class ParisPopFiltersBlock extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.handleClearFilterClick = this.handleClearFilterClick.bind(this)
  }

  handleClearFilterClick (e) {
    const { setFilter } = this.props
    e.stopPropagation()
    setFilter(null)
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
      ref={n => { this.$root = n }}>
      <div className={`${c}__filters-block-head`}
        onClick={() => toggleFiltersPanel(!isActive)}>
        <div className={`${c}__filters-block-title`}>
          <ParagraphTitle>Filtrer</ParagraphTitle>
          <button className={`${c}__filters-block-close ${c}__filters-block-close_desktop`}>
            <Svg src='https://www.liberation.fr/apps/static/assets/up-arrow-head-icon_24.svg' />
          </button>
          <button className={`${c}__filters-block-close ${c}__filters-block-close_mobile`}>
            <Svg src='https://www.liberation.fr/apps/static/assets/down-arrow-head-icon_24.svg' />
          </button>
        </div>
        <div className={`${c}__filters-block-active-filter`}>
          <Paragraph>
            <span>Filtré sur : </span>
            <span>{activeFilterDisplayName}</span>
          </Paragraph>
          <button onClick={this.handleClearFilterClick}>
            <Svg src='https://www.liberation.fr/apps/static/assets/tilted-cross-icon_24.svg' />
          </button>
        </div>
      </div>
      <div className={`${c}__filters-list`}>{
        filters.map((filter, i) => {
          return <div key={i}
            className={`${c}__filter`}>
            <Annotation>{filter.label}</Annotation>
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
