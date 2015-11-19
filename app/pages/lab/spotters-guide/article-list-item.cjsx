React = require 'react'

ArticleListItem = React.createClass
  getDefaultProps: ->
    title: ''
    onClick: ->

  render: ->
    <button type="button" onClick={@props.onClick}>{@props.title}</button>

module.exports = ArticleListItem
