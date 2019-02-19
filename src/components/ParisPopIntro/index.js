import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import ParisPopCaption from '../ParisPopCaption'

export default class ParisPopIntro extends Component {
  constructor (props) {
    super(props)
    this.c = props.appRootClass
    this.h2r = new Parser()
  }

  render () {
    const { c, props, h2r } = this
    const { texts, credits } = props

    return <div className={`${c}__intro`}>
      <div className={`${c}__intro-illustration`}></div>
      <div className={`${c}__intro-content`}>{
        texts.map(chunk => {
          return (chunk.paragraph_type === 'paragraph') 
            ? <Paragraph>{h2r.parse(chunk.text)}</Paragraph>
            : <Annotation>{h2r.parse(chunk.text)}</Annotation>
        })
      }</div>
      <Paragraph>Intro</Paragraph>
      <button onClick={props.closeIntro}>Close</button>
      <ParisPopCaption appRootClass={c} />
    </div>
  }
}
