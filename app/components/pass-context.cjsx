React = require 'react'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = React.createClass
  contextTypes:
    router: routerShape
    geordi: React.PropTypes.object

  childContextTypes:
    router: routerShape
    geordi: React.PropTypes.object

  getChildContext: ->
    @props.context

  render: ->
    @props.children
