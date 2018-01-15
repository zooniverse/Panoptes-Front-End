React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{routerShape} = require 'react-router/lib/PropTypes'

module.exports = createReactClass
  contextTypes:
    initialLoadComplete: PropTypes.bool
    router: routerShape
    user: PropTypes.object
    geordi: PropTypes.object
    notificationsCounter: PropTypes.object
    unreadNotificationsCount: PropTypes.number
    pusher: PropTypes.object

  childContextTypes:
    initialLoadComplete: PropTypes.bool
    router: routerShape
    user: PropTypes.object
    geordi: PropTypes.object
    notificationsCounter: PropTypes.object
    unreadNotificationsCount: PropTypes.number
    pusher: PropTypes.object

  getChildContext: ->
    @props.context

  render: ->
    @props.children
