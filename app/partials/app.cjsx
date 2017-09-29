React = require 'react'
auth = require 'panoptes-client/lib/auth'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'
`import AppStatus from './app-status';`
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'
NotificationsCounter = require('../lib/notifications-counter').default
apiClient = require 'panoptes-client/lib/api-client'
{CommsClient} = require('../lib/comms-client')

counterpart.registerTranslations 'en',
  mainApp:
    title: 'Zooniverse'

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    notificationsCounter: React.PropTypes.object
    unreadNotificationsCount: React.PropTypes.number
    comms: React.PropTypes.object

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    notificationsCounter: @props.notificationsCounter
    unreadNotificationsCount: @state.unreadNotificationsCount
    comms: @props.comms

  getInitialState: ->
    initialLoadComplete: false
    user: null

  getDefaultProps: ->
    notificationsCounter: new NotificationsCounter()
    comms: new CommsClient()

  componentWillMount: ->
    @geordiLogger = new GeordiLogger

  componentDidMount: ->
    @props.notificationsCounter.listen (unreadNotificationsCount) =>
      @setState {unreadNotificationsCount}

    window.comms = @props.comms
    @props.comms.connect()

    auth.listen 'change', @handleAuthChange
    @handleAuthChange()
    generateSessionID()

  componentWillUnmount: ->
    @props.comms.disconnect()
    auth.stopListening 'change', @handleAuthChange

  componentWillReceiveProps: (nextProps) ->
    @updateNotificationsCount params: nextProps.params

  handleAuthChange: ->
    @geordiLogger.forget ['userID']
    auth.checkCurrent().then (user) =>
      @setState
        initialLoadComplete: true
        user: user
      @props.comms.authenticate(auth)
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
