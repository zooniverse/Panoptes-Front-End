React = require 'react'
auth = require 'panoptes-client/lib/auth'
`import AppStatus from './app-status';`
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'
NotificationsCounter = require('../lib/notifications-counter').default
Pusher = require 'pusher-js'
apiClient = require 'panoptes-client/lib/api-client'
pusherEnv = require('../lib/pusher-env').default

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    pusher: React.PropTypes.object

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    notificationsCounter: @props.notificationsCounter
    unreadNotificationsCount: @state.unreadNotificationsCount
    pusher: @props.pusher

  getInitialState: ->
    initialLoadComplete: false
    user: null

  getDefaultProps: ->
    notificationsCounter: new NotificationsCounter()
    pusher: (pusherEnv && new Pusher(pusherEnv, {encrypted: true}))

  componentWillMount: ->
    @geordiLogger = new GeordiLogger

  componentDidMount: ->
    @props.notificationsCounter.listen (unreadNotificationsCount) =>
      @setState {unreadNotificationsCount}

    auth.listen 'change', @handleAuthChange
    generateSessionID()
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  componentWillReceiveProps: (nextProps) ->
    @updateNotificationsCount params: nextProps.params

  handleAuthChange: ->
    @geordiLogger.forget ['userID']
    auth.checkCurrent().then (user) =>
      @setState
        initialLoadComplete: true
        user: user
      @updateNotificationsCount {user}
      @geordiLogger.remember userID: user.id if user?

  updateNotificationsCount: ({user, params}) ->
    user or= @state.user
    params or= @props.params
    {owner, name} = params
    @props.notificationsCounter.update(user, owner, name)

  render: ->
    <div className="panoptes-main">
      <AppStatus />
      <IOStatus />
      <AppLayout {...@props}>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
