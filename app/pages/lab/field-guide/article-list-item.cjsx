React = require 'react'
createReactClass = require 'create-react-class'
CroppedImage = require('../../../components/cropped-image').default

ArticleListItem = createReactClass
  getDefaultProps: ->
    icon: null
    title: ''
    onClick: ->

  render: ->
    <button type="button" className="field-guide-editor-article-button" onClick={@props.onClick}>
      <CroppedImage className="field-guide-editor-article-button-icon" src={@props.icon} aspectRatio={1} width="3em" height="3em" style={borderRadius: '50%', verticalAlign: 'middle'} />{' '}
      <span className="field-guide-editor-article-button-title">{@props.title}</span>
    </button>

module.exports = ArticleListItem
