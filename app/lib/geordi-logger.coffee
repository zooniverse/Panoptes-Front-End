GeordiClient = require 'zooniverse-geordi-client'

class GeordiLogger # Make calls to the Geordi API to log user activity

  @tokens = ['zooHome', 'zooTalk', 'zooniverse/gravity-spy', 'mschwamb/comet-hunters']
  # during dev (for staging):
  # @tokens = ['zooHome', 'zooTalk', 'zooniverse/gravity-spy', 'mschwamb/planet-four-terrains']

  keys:
    projectToken: 'zooHome'

  geordi: null

  instance: =>
    @geordi = @geordi || @makeGeordi @keys?.projectToken

  getEnv: ->
    shell_env = process.env.NODE_ENV if process.env.NODE_ENV=="production"
    reg = /\W?env=(\w+)/
    browser_env = window?.location?.search?.match(reg)?[1]
    shell_env || browser_env || 'staging'
    
  makeGeordi: (projectSlug) ->
    new GeordiClient
      env: @getEnv()
      projectToken: projectSlug || @keys?.projectToken
      zooUserIDGetter: () => @keys?.userID
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
