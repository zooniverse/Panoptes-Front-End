React = require 'react'
{History} = require 'react-router'

module.exports = React.createClass
  mixins: [History]

  childContextTypes:
    history: React.PropTypes.oneOfType [
      React.PropTypes.array,
      React.PropTypes.object
      ]

  getChildContext: ->
    @props.context

  render: ->
    @props.children
