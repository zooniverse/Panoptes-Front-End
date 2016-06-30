React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
AppLayout = require('../layout').default
GeordiLogger = require '../lib/geordi-logger'
{generateSessionID} = require '../lib/session'

PanoptesApp = React.createClass
  geordiLogger: null # Maintains project and subject context for the Geordi client

  childContextTypes:
    initialLoadComplete: React.PropTypes.bool
    user: React.PropTypes.object
    updateUser: React.PropTypes.func
    geordi: React.PropTypes.object

  getChildContext: ->
    initialLoadComplete: @state.initialLoadComplete
    user: @state.user
    updateUser: @updateUser
    geordi: @geordiLogger

  getInitialState: ->
    initialLoadComplete: false
    user: null

  componentWillMount: ->
    @setupGeordi(@state.user)
  
  componentDidMount: ->
    auth.listen 'change', @handleAuthChange
    generateSessionID()
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  setupGeordi: (user) ->
    @geordiLogger = new GeordiLogger user

  handleAuthChange: ->
    auth.checkCurrent().then (user) =>
      @setState
        initialLoadComplete: true
        user: user
      @setupGeordi(user)

  render: ->
    <div className="panoptes-main">
      <IOStatus />
      <AppLayout>
        {React.cloneElement @props.children, user: @state.user}
      </AppLayout>
    </div>

module.exports = PanoptesApp
