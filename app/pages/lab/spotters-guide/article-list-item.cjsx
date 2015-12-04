React = require 'react'

ArticleListItem = React.createClass
  getDefaultProps: ->
    icon: null
    title: ''
    onClick: ->

  render: ->
    <button type="button" onClick={@props.onClick}>
      {if @props.icon
        <img src={@props.icon} style={maxHeight: '3em', maxWidth: '3em'} />}
      {@props.title}
    </button>

module.exports = ArticleListItem
