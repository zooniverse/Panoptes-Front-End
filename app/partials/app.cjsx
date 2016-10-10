React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'
NotificationsCounter = require('../lib/notifications-counter').default
Pusher = require 'pusher-js'
apiClient = require 'panoptes-client/lib/api-client'

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client

  pusher: new Pusher('79e8e05ea522377ba6db', {encrypted: true});

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    pusher: React.PropTypes.func

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    notificationsCounter: @props.notificationsCounter
    unreadNotificationsCount: @state.unreadNotificationsCount
    pusher: @pusher

  getInitialState: ->
    initialLoadComplete: false
    user: null

  getDefaultProps: ->
    notificationsCounter: new NotificationsCounter()

  componentWillMount: ->
    @geordiLogger = new GeordiLogger

    # if apiClient.root is "https://panoptes-staging.zooniverse.org/api"
      # @pusher = new Pusher('95781402b5854a712a03', {encrypted: true});
    # else
    #   @pusher = new Pusher('79e8e05ea522377ba6db', {encrypted: true});

    # console.log('pusher', @pusher)

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
      <IOStatus />
      <AppLayout {...@props}>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
