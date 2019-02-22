import React, { Component } from 'react'
import logoGlyph from './assets/logo-glyph.svg'

export default class LogoGlyph extends Component {
  constructor () {
    super()
    this.state = {
      parentFontSize: 18,
      parentLineHeight: 24
    }
    this.adjustSizeFromParent = this.adjustSizeFromParent.bind(this)
    window.setInterval(this.adjustSizeFromParent, 2000)
  }

  componentWillUnmount () {
    window.clearInterval(this.adjustSizeFromParent)
  }

  componentDidMount () {
    this.adjustSizeFromParent()
  }

  componentDidUpdate () {
    this.adjustSizeFromParent()
  }

  adjustSizeFromParent () {
    const { $node, state } = this
    if ($node) {
      const $parent = $node.parentNode
      const parentStyle = window.getComputedStyle($parent)
      const parentFontSize = parseFloat(parentStyle.fontSize.replace('px', ''))
      const parentLineHeight = parseFloat(parentStyle.lineHeight.replace('px', ''))
      if (parentFontSize !== state.parentFontSize ||
        parentLineHeight !== state.parentLineHeight) {
        this.setState({
          parentFontSize,
          parentLineHeight
        })
      }
      return {
        parentFontSize,
        parentLineHeight
      }
    }
  }

  render () {
    const { state } = this
    const style = {
      height: `${state.parentFontSize * 0.7}px`,
      lineHeight: `${state.parentLineHeight}px`
    }
    return <img alt=''
      src={logoGlyph}
      className='lblb-logo-glyph'
      ref={n => { this.$node = n }}
      style={style} />
  }
}
