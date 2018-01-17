React = require 'react'
createReactClass = require 'create-react-class'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = createReactClass
  contextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    pusher: React.PropTypes.object

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    router: routerShape
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    pusher: React.PropTypes.object

  getChildContext: ->
    @props.context

  render: ->
    @props.children
