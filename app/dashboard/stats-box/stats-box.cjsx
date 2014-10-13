# @cjsx React.DOM

React = require 'react'

StatsItem = require './stats-item'

module?.exports = React.createClass
  displayName: 'StatsBox'

  propTypes:
    data: React.PropTypes.object

  statsItem: (obj, i) ->
    <StatsItem key={i} header={obj.v} label={obj.k} />

  render: ->
    statsItems = @dataKeyValues().map(@statsItem)

    <div className="stats-box">
      <h2>{@props.title}</h2>
      <div className="stats-items">
        {statsItems}
      </div>
    </div>

  dataKeyValues: ->
    {k: k, v: v} for own k, v of @props.data
