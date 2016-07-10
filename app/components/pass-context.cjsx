React = require 'react'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = React.createClass
  contextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object

  getChildContext: ->
    @props.context

  render: ->
    @props.children
