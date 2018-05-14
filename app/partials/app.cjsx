React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
auth = require 'panoptes-client/lib/auth'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'
`import AppStatus from './app-status';`
IOStatus = require './io-status'
AppLayout = require('../layout').default
{generateSessionID} = require '../lib/session'
NotificationsCounter = require('../lib/notifications-counter').default
Pusher = require 'pusher-js'
apiClient = require 'panoptes-client/lib/api-client'
pusherEnv = require('../lib/pusher-env').default

GeordiLogger = (require '../lib/zooniverse-logging').default
GeordiLogAdapter = (require '../lib/geordi-log-adapter').default
GALogAdapter = (require '../lib/ga-log-adapter').default

counterpart.registerTranslations 'en',
  mainApp:
    title: 'Zooniverse'

PanoptesApp = createReactClass
  geordiLogger: null # Maintains project and subject context for the Geordi client

  childContextTypes:
    initialLoadComplete: PropTypes.bool
    user: PropTypes.object
    geordi: PropTypes.object
    notificationsCounter: PropTypes.object
    unreadNotificationsCount: PropTypes.number
    pusher: PropTypes.object

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
    @geordiLogger.subscribe(new GeordiLogAdapter(), new GALogAdapter('ga'))

  componentDidMount: ->
    @props.notificationsCounter.listen (unreadNotificationsCount) =>
      @setState {unreadNotificationsCount}

    auth.listen 'change', @handleAuthChange
    @handleAuthChange()
    generateSessionID()

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
      <Helmet defaultTitle={counterpart 'mainApp.title'} titleTemplate="%s \u2014 #{counterpart 'mainApp.title'}" />
      <AppStatus />
      <IOStatus />
      <AppLayout {...@props}>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
