React = require 'react'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = React.createClass
  contextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    comms: React.PropTypes.object

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    comms: React.PropTypes.object

  getChildContext: ->
    @props.context

  render: ->
    @props.children
