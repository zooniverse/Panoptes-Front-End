config = require './experiments-config'
{getSessionID} = require '../lib/session'
DEBUG = false

class ExperimentsClient # Client for the ExperimentServer

  EXPERIMENT_SERVER_PRODUCTION_URL: "https://experiments.zooniverse.org"
  EXPERIMENT_SERVER_STAGING_URL: "https://experiments.staging.zooniverse.org"
  #EXPERIMENT_SERVER_DEVELOPMENT_URL: "http://localhost:4567"
  EXPERIMENT_SERVER_URL_TO_USE: null
  
  ensureEnvironmentSet: ->
    if not @EXPERIMENT_SERVER_URL_TO_USE?
      if window.location.hostname=="www.zooniverse.org"
        @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_PRODUCTION_URL
      #else if window.location.hostname=="localhost"
      #  @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_DEVELOPMENT_URL
      else
        @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_STAGING_URL
    @EXPERIMENT_SERVER_URL_TO_USE
  
  getEnabledExperiments: ->
    @ensureEnvironmentSet()
    switch @EXPERIMENT_SERVER_URL_TO_USE
      when @EXPERIMENT_SERVER_PRODUCTION_URL
        config.ENABLED_EXPERIMENTS_PRODUCTION
      else
        config.ENABLED_EXPERIMENTS_STAGING

  getInterventionDetails: ->
    @ensureEnvironmentSet()
    switch @EXPERIMENT_SERVER_URL_TO_USE
      when @EXPERIMENT_SERVER_PRODUCTION_URL
        config.INTERVENTION_DETAILS_PRODUCTION
      else
        config.INTERVENTION_DETAILS_STAGING

  getProjectSlugs: ->
    @ensureEnvironmentSet()
    switch @EXPERIMENT_SERVER_URL_TO_USE
      when @EXPERIMENT_SERVER_PRODUCTION_URL
        config.PROJECT_SLUGS_PRODUCTION
      else
        config.PROJECT_SLUGS_STAGING

  lookupProjectSlug: (enabledExperiments, experimentName) ->
    thisProjectSlug for thisProjectSlug, experimentsForThisSlug of enabledExperiments when experimentName in experimentsForThisSlug

  getProjectSlugForExperiment: (experimentName) ->
    @ensureEnvironmentSet()
    switch @EXPERIMENT_SERVER_URL_TO_USE
      when @EXPERIMENT_SERVER_PRODUCTION_URL
        @lookupProjectSlug config.ENABLED_EXPERIMENTS_PRODUCTION, experimentName
      else
        @lookupProjectSlug config.ENABLED_EXPERIMENTS_STAGING, experimentName

  # At the start (or resume) of an experiment, make sure geordi gets updated.
  #
  # (Note: for experiments that have a separate "registration" before first event, this would also be the place
  # that we would do that POST to the experiment server
  # - this isn't currently done here as we don't have an experiment that needs registration)
  #
  startOrResumeExperiment: (interventionMonitor, geordi) ->
    if interventionMonitor?.latestFromSugar and interventionMonitor?.latestFromSugar["active"]
      experimentName = interventionMonitor?.latestFromSugar["experiment_name"]
      cohort = interventionMonitor?.latestFromSugar["cohort"]
      @logExperimentState geordi, "experimentStartOrResume", interventionMonitor?.latestFromSugar
      # TODO check geordi experiment value - if it was null, log an experimentStart event else log a resume event.
      geordi?.remember
        experiment: experimentName
        cohort: cohort
    else
      if interventionMonitor?.latestFromSugar and not interventionMonitor?.latestFromSugar["active"]
        @logExperimentState geordi, "experimentEnd", interventionMonitor?.latestFromSugar
      # TODO log an experiment end event
      geordi?.remember
        experiment: null
        cohort: null  

  # TODO Design a better way for Geordi to handle long "data" field values (currently it's VARCHAR(512) set by Loopback
  # - so we need to compress the string as much as possible and ensure it is never longer than 512 or that will cause a
  # 500 error
  #
  simplifyParticipantDataForLogging: (data) ->
    fieldsToInclude = ["current_session_id","current_session_history","current_session_plan","seq_of_next_event","next_event","intervention_time","active"]
    fieldnameShorteningMap = {
      current_session_id: "sessID"
      current_session_history: "hist"
      current_session_plan: "plan"
      seq_of_next_event: "next_evt_pos"
      intervention_time: "ivn_next"
    }
    valueCompressionMap = {
      intervention: "i"
      classification: "c"
      "-question-": "qu"
      "-statement-": "st"
      gamisation: "gam"
      valued: "val"
      learning: "lrn"
    }
    simpleData = {}
    for field in fieldsToInclude
      if field of data
        fieldnameToUse = field
        if field of fieldnameShorteningMap
          fieldnameToUse = fieldnameShorteningMap[field]
        valueToUse = JSON.parse(JSON.stringify(data[field])) # deep clone
        if typeof valueToUse is 'string'
          valueToUse = @replaceAllSubStringsByRegEx valueToUse, valueCompressionMap
        else if typeof valueToUse is 'object'
          for subValue, index in valueToUse
            if typeof subValue is 'string'
              valueToUse[index] = @replaceAllSubStringsByRegEx subValue, valueCompressionMap
        simpleData[fieldnameToUse] = valueToUse
    simpleData

  replaceAllSubStringsByRegEx: (stringToModify, valueCompressionMap) ->
    for regexStr, replacement of valueCompressionMap
      regex = new RegExp regexStr,"gi"
      stringToModify = stringToModify.replace regex, replacement
    stringToModify

  # .. and if it's too long, we give up.
  safeJSON: (simplifiedData) ->
    if simplifiedData
      jsonString = JSON.stringify(simplifiedData)
      if jsonString.length >= 512
        jsonString = JSON.stringify {
          error: "too_much_data"
          details: "The data passed to Geordi was too large to store, at #{jsonString.length} characters (maximum is 512)."
        }
      jsonString
    else
      null

  # experimentState == "experimentStart", "classificationStart", "classificationEnd", "interventionStart", "interventionEnd", or "experimentEnd"
  logExperimentState: (geordi, experimentState, data) ->
    simpleData = null
    if data?
      simpleData = @simplifyParticipantDataForLogging data
    geordi?.logEvent
      type: "experiment"
      relatedID: experimentState
      data: @safeJSON simpleData

  # check if this project has an experiment enabled. Return experiment_name if so.
  #
  # (If it does, it should be notifying experiment server of its classifications, 
  #  which will register it or progress it)
  checkForExperiment: (projectSlug) ->
    enabledExperiments = @getEnabledExperiments()
    if projectSlug of enabledExperiments
      enabledExperiments[projectSlug]

  # type = "classification" or "intervention", and id is the classification_id or intervention_id correspondingly
  postDataToExperimentServer: (interventionMonitor, geordi, experimentName, userID, sessionID, type, id) ->
    @ensureEnvironmentSet()

    if not sessionID?
      sessionID = getSessionID()

    postPath = "/experiment/#{experimentName}/user/#{userID}/session/#{sessionID}/#{type}/#{id}"
    postUrl = "#{@EXPERIMENT_SERVER_URL_TO_USE}#{postPath}"

    request = new XMLHttpRequest()
    request.open 'POST', postUrl, true
    if DEBUG
      request.addEventListener "readystatechange", (e) =>
      if request.readyState is 4
        if request.status is 200
          console.log "Success #{request.status} #{request.statusText}", request.responseText
        else
          console.log "Error #{request.status} #{request.statusText}: ", request.responseText
    response = request.send()
    
    if type=="intervention"
      @logExperimentState geordi, "interventionEnd", interventionMonitor?.latestFromSugar
    else if type=="classification"
      @logExperimentState geordi, "classificationEnd", interventionMonitor?.latestFromSugar

    response

  getInterventionFromConfig: (projectSlug, experimentName, interventionID) ->
    enabledExperiments = @getEnabledExperiments()
    interventionDetails = @getInterventionDetails()
    if experimentName in enabledExperiments[projectSlug] and projectSlug of interventionDetails
      if experimentName of interventionDetails[projectSlug]
        if interventionID of interventionDetails[projectSlug][experimentName]
          interventionDetails[projectSlug][experimentName][interventionID]

  constructInterventionFromSugarData: (sugarData) ->
    if "experiment_name" of sugarData
      experimentName = sugarData["experiment_name"]
      projectSlug = @getProjectSlugForExperiment(experimentName)
      switch experimentName
        when config.COMET_HUNTERS_VOLCROWE_EXPERIMENT
          if "intervention_time" of sugarData
            if sugarData["intervention_time"]==true
              if "next_event" of sugarData
                interventionID = sugarData["next_event"]
                @getInterventionFromConfig projectSlug, experimentName, interventionID
        else
          console.log "Intervention Requested for Unsupported Experiment '#{experimentName}'"

module.exports = ExperimentsClient