React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
MainFooter = require './main-footer'
GeordiClient = require 'zooniverse-geordi-client'
{generateSessionID} = require '../lib/session'

class GeordiLogger
  constructor: (@state, @geordi) ->

  keys: {}

  geordi: null

  instance: =>
    @geordi = @geordi || @makeGeordi @keys?.projectToken

  makeGeordi: (projectSlug) ->
    new GeordiClient
      server: @state?.env
      projectToken: projectSlug || ''
      zooUserIDGetter: () => @state.user?.id
      subjectGetter: () => @keys?.subjectID

  makeHandler: (defType) ->
    instance = @instance
    (eventData, eventType) ->
        eventType = defType if typeof linkType isnt 'string'
        instance()?.logEvent
          type: eventType
          data: "\"#{eventData}\""

  logEvent: (logEntry) ->
    geordi = @instance()
    newEntry = Object.assign {}, logEntry, @keys
    geordi?.logEvent newEntry
    console.log 'No logger available for event ', JSON.stringify(logEntry) unless geordi?.logEvent

  remember: (keyVals) ->
    rebuild = keyVals?.projectToken? && (keyVals?.projectToken != @geordi?.projectToken)
    @geordi = @makeGeordi keyVals.projectToken if rebuild
    @keys = Object.assign {}, @keys, keyVals

  forget: (forgetKeys) ->
    rebuild = false
    for key in forgetKeys
      rebuild = true if key == 'projectToken'
      delete @keys[key]

    @geordi = @makeGeordi '' if rebuild

module.exports = React.createClass
  displayName: 'PanoptesApp'

  geordiLogger: null

  childContextTypes:
    user: React.PropTypes.object
    updateUser: React.PropTypes.func
    geordi: React.PropTypes.object

  getChildContext: ->
    user: @state.user
    updateUser: @updateUser
    geordi: @geordiLogger

  getEnv: ->
    reg = /\W?env=(\w+)/
    browser_env = window?.location?.search?.match(reg)
    @state?.env || browser_env || 'staging'

  getInitialState: ->
    user: null
    env: @getEnv()
    initialLoadComplete: false

  updateUser: (user) ->
    @setState user: user

  componentDidMount: ->
    auth.listen 'change', @handleAuthChange
    generateSessionID()
    @handleAuthChange()

  componentWillUnmount: ->
    auth.stopListening 'change', @handleAuthChange

  componentWillUpdate: (nextProps, nextState) ->
    @geordiLogger = @geordiLogger || new GeordiLogger nextState

  handleAuthChange: ->
    auth.checkCurrent().then (user) =>
      @setState
        user: user
        initialLoadComplete: true

  render: ->
    <div className="panoptes-main">
      <IOStatus />
      <MainHeader user={@state.user} />
      <div className="main-content">
        {if @state.initialLoadComplete
          React.cloneElement @props.children, {user: @state.user}}
      </div>
      <MainFooter user={@state.user} />
    </div>
