import React, { Component } from 'react'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import LogoGlyph from '../LogoGlyph'

export default class DataLoadingError extends Component {
  render () {
    const { href } = window.location
    return <div className="lblb-data-loading-error">
      <Paragraph>
        Une erreur de chargement est survenue,<br />
        <a href={href}>recharger la page ?</a><br /><br />
        <LogoGlyph />
      </Paragraph>
    </div>
  }
}
