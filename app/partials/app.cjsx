React = require 'react'
auth = require 'panoptes-client/lib/auth'
IOStatus = require './io-status'
MainHeader = require './main-header'
MainFooter = require './main-footer'
GeordiClient = require 'zooniverse-geordi-client'
{generateSessionID} = require '../lib/session'

class GeordiLogger # Make calls to the Geordi API to log user activity
  constructor: (@state, @geordi) ->

  @tokens = ['zooHome', 'zooTalk', 'zooniverse/gravity-spy']

  keys:
    projectToken: 'zooHome'

  geordi: null

  instance: =>
    @geordi = @geordi || @makeGeordi @keys?.projectToken

  makeGeordi: (projectSlug) ->
    new GeordiClient
      env: @state?.env
      projectToken: projectSlug || @keys?.projectToken
      zooUserIDGetter: () => @state.user?.id
      subjectGetter: () => @keys?.subjectID

  makeHandler: (defType) -> # Once defined, efficiently logs different data to same event type
    (eventData, eventType) =>
        eventType = defType if typeof eventType isnt 'string'
        @logEvent
          type: eventType
          relatedID: eventData

  logEvent: (logEntry) -> # Accepts key/values to make appropriate Geordi logging
    newEntry = Object.assign {}, logEntry, @keys
    if GeordiLogger.tokens.indexOf(newEntry.projectToken) > -1
      @instance().logEvent newEntry
      console.warn 'No Geordi logger available for event ', JSON.stringify(logEntry) unless @instance().logEvent

  remember: (eventData) ->
    reset = eventData?.projectToken? && (eventData?.projectToken != @instance().projectToken)
    @instance().update {projectToken: eventData.projectToken} if reset
    @keys = Object.assign {}, @keys, eventData

  forget: (forgetKeys) ->
    reset = false
    for key in forgetKeys
      reset = (key == 'projectToken')
      delete @keys[key]

    @remember {projectToken: 'zooHome'} if reset

module.exports = React.createClass
  displayName: 'PanoptesApp'

  geordiLogger: null # Maintains project and subject context for the Geordi client

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
    @state?.env || browser_env?[1] || 'staging'

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
