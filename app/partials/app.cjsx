React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'
InterventionMonitor = require '../lib/intervention-monitor'

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client
  interventionMonitor: null # Monitors interventions coming via Sugar, for example from Experiment Server, throughout the app

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    interventionMonitor: React.PropTypes.object

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    interventionMonitor: @interventionMonitor

  getInitialState: ->
    initialLoadComplete: false
    user: null

  componentWillMount: ->
    @geordiLogger = new GeordiLogger
    @interventionMonitor = new InterventionMonitor
  
  componentDidMount: ->
    auth.listen 'change', @handleAuthChange
    generateSessionID()
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  handleAuthChange: ->
    @geordiLogger.forget ['userID']
    auth.checkCurrent().then (user) =>
      @setState
        initialLoadComplete: true
        user: user
      @geordiLogger.remember userID: user.id if user?

  render: ->
    <div className="panoptes-main">
      <IOStatus />
      <AppLayout>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
