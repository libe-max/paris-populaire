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
        <div className={`${c}__mb-map-marker ${c}__mb-map-marker_exists`} />
        <Annotation>Lieu visible</Annotation>
      </div>
      <div className={`${c}__caption-field`}>
        <div className={`${c}__mb-map-marker ${c}__mb-map-marker_not-exists`} />
        <Annotation>Lieu invisible ou transformé</Annotation>
      </div>
      {('geolocation' in navigator)
        ? <div className={`${c}__caption-field`}>
          <div className={`${c}__lf-map-marker_user`} />
          <Annotation>Votre position</Annotation>
        </div>
        : ''
      }
    </div>
  }
}
