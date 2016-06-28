GeordiClient = require 'zooniverse-geordi-client'

class GeordiLogger # Make calls to the Geordi API to log user activity
  constructor: (@state, @geordi) ->

  @tokens = ['zooHome', 'zooTalk', 'zooniverse/gravity-spy']
  @GEORDI_WARNINGS_TIMEOUT_INTERVAL = 5 * 60 * 1000 # only warn about Geordi down once every 5 mins, to avoid console spam

  keys:
    projectToken: 'zooHome'

  geordi: null

  suppressWarnings: false

  suppressWarningsForAWhile: ->
    @suppressWarnings = true
    setTimeout =>
      @suppressWarnings = false
    , GeordiLogger.GEORDI_WARNINGS_TIMEOUT_INTERVAL

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
      .catch (err) =>
        if !@suppressWarnings
          console.warn "Warning: Error was encountered logging to Geordi server [#{@state?.env} - #{@instance().GEORDI_SERVER_URL[@state?.env]}]:",err
          @suppressWarningsForAWhile()

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

module.exports = GeordiLogger
