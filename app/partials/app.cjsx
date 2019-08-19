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
apiClient = require 'panoptes-client/lib/api-client'

GeordiLogger = (require '../lib/zooniverse-logging').default
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

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    notificationsCounter: @props.notificationsCounter
    unreadNotificationsCount: @state.unreadNotificationsCount

  getInitialState: ->
    initialLoadComplete: false
    user: null

  getDefaultProps: ->
    notificationsCounter: new NotificationsCounter()

  componentWillMount: ->
    @geordiLogger = new GeordiLogger
    @geordiLogger.subscribe(new GALogAdapter(window, 'ga'))

  componentDidMount: ->
    if this.props.location.query?.language
      counterpart.setLocale(this.props.location.query.language);
    @props.notificationsCounter.listen (unreadNotificationsCount) =>
      @setState {unreadNotificationsCount}

    auth.listen 'change', @handleAuthChange
    @handleAuthChange()
    generateSessionID()
  
  componentDidUpdate: (prevProps) ->
    if prevProps.params isnt @props.params 
      @updateNotificationsCount()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  handleAuthChange: ->
    @geordiLogger.forget ['userID']
    auth.checkCurrent().then (user) =>
      @setState
        initialLoadComplete: true
        user: user
      @updateNotificationsCount user
      @geordiLogger.remember userID: user.id if user?

  updateNotificationsCount: (user) ->
    user or= @state.user
    @props.notificationsCounter.update(user)

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
