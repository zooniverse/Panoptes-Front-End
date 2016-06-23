React = require 'react'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = React.createClass
  contextTypes:
    router: routerShape

  childContextTypes:
    router: routerShape

  getChildContext: ->
    @props.context

  render: ->
    @props.children
