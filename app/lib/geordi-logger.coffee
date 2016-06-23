GeordiClient = require 'zooniverse-geordi-client'

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

module.exports = GeordiLogger
