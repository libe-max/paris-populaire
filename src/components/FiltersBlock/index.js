import React, { Component } from 'react'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'

export default class FiltersBlock extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
  }

  render () {
    const { c, props } = this
    const { isActive, activeFilter, filters } = props

    const classes = [`${c}__filters-block`]
    if (isActive) classes.push(`${c}__filters-block_active`)
    if (activeFilter) classes.push(`${c}__filters-block_with-filter`)

    return <div className={classes.join(' ')}>
      <div className={`${c}__filters-block-head`}>
        <div className={`${c}__filters-block-title`}>
          <Paragraph>Filtrer</Paragraph>
        </div>
        <div className={`${c}__filters-block-active-filter`}>
          <Paragraph>
            <span>Filtré sur : </span>
            <span>{activeFilter ? activeFilter.display_value : ''}</span>
            <button>Close</button>
          </Paragraph>
        </div>
        <div className={`${c}__filters-list`}>{
          filters.map((filter, i) => {
            return <select key={i}>
              <option value='lol'>Lol</option>
              <option value='lol'>Lol</option>
            </select>
          })
        }</div>
      </div>
    </div>
  }
}
