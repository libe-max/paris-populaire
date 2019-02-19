import React, { Component } from 'react'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import ParisPopCaption from '../ParisPopCaption'

export default class ParisPopIntro extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
  }

  render () {
    const { c, props, state } = this

    return <div className={`${c}__intro`}>
      <Paragraph>Intro</Paragraph>
      <button onClick={props.closeIntro}>Close</button>
      <ParisPopCaption appRootClass={c} />
    </div>
  }
}
