# @cjsx React.DOM

React = require 'react'

module?.exports = React.createClass
  displayName: 'StatsItem'

  propTypes:
    header: React.PropTypes.string
    label: React.PropTypes.string

  render: ->
    <div className="stats-item">
      <h1>{@props.header}</h1>
      <p>{@snakeToTitleCase(@props.label)}</p>
    </div>
    
  snakeToTitleCase: (str) ->
    str.replace(/_/g, ' ').replace /(?:^|\s)\S/g, (w) -> w.toUpperCase()
