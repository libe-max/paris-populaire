import React, { Component } from 'react'
import AnnotationTitle from 'libe-components/lib/text-levels/AnnotationTitle'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class ParisPopCaption extends Component {
  render () {
    const c = this.props.appRootClass
    return <div className={`${c}__caption`}>
      <div className={`${c}__caption-field`}>
        <AnnotationTitle>Légende</AnnotationTitle>
      </div>
      <div className={`${c}__caption-field`}>
        <div className={`${c}__map-marker ${c}__map-marker_exists`} />
        <Annotation>Lieu encore visible</Annotation>
      </div>
      <div className={`${c}__caption-field`}>
        <div className={`${c}__map-marker ${c}__map-marker_not-exists`} />
        <Annotation>Lieu détruit</Annotation>
      </div>
    </div>
  }
}
