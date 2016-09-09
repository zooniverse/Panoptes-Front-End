React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'
InterventionMonitor = require '../lib/intervention-monitor'
ExperimentsClient = require '../lib/experiments-client'

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client
  interventionMonitor: null # Monitors interventions coming via Sugar, for example from Experiment Server, throughout the app
  experimentsClient: null # For managing experiments and interactions with the Experiment Server

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    geordi: React.PropTypes.object
    interventionMonitor: React.PropTypes.object
    experimentsClient: React.PropTypes.object

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    geordi: @geordiLogger
    interventionMonitor: @interventionMonitor
    experimentsClient: @experimentsClient

  getInitialState: ->
    initialLoadComplete: false
    user: null

  componentWillMount: ->
    @geordiLogger = new GeordiLogger
    @interventionMonitor = new InterventionMonitor
    @experimentsClient = new ExperimentsClient
  
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
      <AppLayout {...@props}>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
