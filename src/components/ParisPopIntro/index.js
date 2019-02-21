import React, { Component } from 'react'
import { Parser } from 'html-to-react'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import PageTitle from 'libe-components/lib/text-levels/PageTitle'
import BlockTitle from 'libe-components/lib/text-levels/BlockTitle'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Annotation from 'libe-components/lib/text-levels/Annotation'
import AnnotationTitle from 'libe-components/lib/text-levels/AnnotationTitle'
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
      <div className={`${c}__intro-illustration`}>
        <PageTitle small>
          <span>Plongée dans le Paris</span>
          <span>Populaire</span>
        </PageTitle>
        <Paragraph big>1830 – 1980</Paragraph>
      </div>
      <div className={`${c}__intro-content`}>
        <div className={`${c}__intro-paragraphs`}>{
          texts.filter(chunk => chunk.paragraph_type === 'paragraph').map((chunk, i) => {
            return <div key={i} className={`${c}__intro-paragraph`}>
              <Paragraph>{h2r.parse(chunk.text)}</Paragraph>
            </div>
          })
        }</div>
        <div className={`${c}__intro-caption`}>
          <ParisPopCaption appRootClass={c} />
        </div>
        <div className={`${c}__intro-credits`}>
          <div className={`${c}__intro-credits-title`}>
            <AnnotationTitle>Crédits</AnnotationTitle>
          </div>
          <div className={`${c}__intro-credit-lines`}>{
            credits.map((chunk, i) => {
              return <div key={i} className={`${c}__intro-credit-line`}>
                <Annotation>{h2r.parse(chunk.credit_line)}</Annotation>
               </div>
            })
          }</div>
        </div>
        <div className={`${c}__intro-contribution`}>{
          texts.filter(chunk => chunk.paragraph_type === 'annotation').map((chunk, i) => {
            return <div key={i} className={`${c}__intro-contribution-text`}>
              <Annotation>{h2r.parse(chunk.text)}</Annotation>
            </div>
          })
        }</div>
        <div className={`${c}__intro-share`}>
          <ShareArticle short />
        </div>
        <div className={`${c}__intro-logo`}>
          <a href='https://www.liberation.fr/libe-labo-data-nouveaux-formats,100538'>
            <img src='assets/libe-labo-logo.png' />
          </a>
        </div>
      </div>
      <button className={`${c}__intro-go-to-map`}
        onClick={props.closeIntro}>
        <Paragraph big>
          Voir la carte
        </Paragraph>
      </button>
    </div>
  }
}
