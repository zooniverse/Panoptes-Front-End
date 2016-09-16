# For managing experiments and interactions with the Experiment Server, and maintaining the current experiment state

config = require './experiments-config'
{getSessionID} = require '../lib/session'
DEBUG = false

class ExperimentsClient # Client for the ExperimentServer

  EXPERIMENT_STATE_CLASSIFYING: "classifying"
  EXPERIMENT_STATE_POST_CLASSIFY: "classified"
  EXPERIMENT_STATE_INTERVENTION_ON_SCREEN: "intervening"
  EXPERIMENT_STATE_WHATS_NEXT: "in-between"
  EXPERIMENT_STATE_FINISHED: "finished"

  EXPERIMENT_SERVER_PRODUCTION_URL: "https://experiments.zooniverse.org"
  EXPERIMENT_SERVER_STAGING_URL: "https://experiments.staging.zooniverse.org"
  #EXPERIMENT_SERVER_DEVELOPMENT_URL: "http://localhost:4567"
  EXPERIMENT_SERVER_URL_TO_USE: null

  currentExperimentState: @EXPERIMENT_STATE_WHATS_NEXT
  # TODO As soon as we support more than one PFE experiment at once (even if on different projects) we'll need to
  # update this class so that it can handle different state for different experiments at the same time.
  # The better approach will be to move this responsibility to the Experiment Server. See
  # https://github.com/zooniverse/experiment-server/issues/31

  ensureEnvironmentSet: ->
    if not @EXPERIMENT_SERVER_URL_TO_USE?
      if window.location.hostname is "www.zooniverse.org"
        @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_PRODUCTION_URL
      #else if window.location.hostname is "localhost"
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
    if interventionMonitor?.latestFromSugar and "experiment_name" of interventionMonitor?.latestFromSugar
      experimentName = interventionMonitor?.latestFromSugar["experiment_name"]
      cohort = interventionMonitor?.latestFromSugar["cohort"]
      geordi?.remember
        experiment: experimentName
        cohort: cohort
      if interventionMonitor?.latestFromSugar["seq_of_next_event"] is 1
        if Object.keys(interventionMonitor?.latestFromSugar["session_histories"]).length > 0
          @logExperimentState geordi, interventionMonitor?.latestFromSugar, "experimentResume"
        else
          @logExperimentState geordi, interventionMonitor?.latestFromSugar, "experimentStart"

  # TODO Design a better way for Geordi to handle long "data" field values (currently it's VARCHAR(512) set by Loopback
  # - so we need to compress the string as much as possible and ensure it is never longer than 512 or that will cause a
  # 500 error. Note: Geordi server will be updated: https://github.com/zooniverse/geordi/issues/87. When it is, these
  # four methods can be removed.
  #
  simplifyParticipantDataForLogging: (participantData, experimentState) ->
    simpleData = {}
    fieldsToInclude = ["current_session_id","current_session_history","seq_of_next_event","next_event","intervention_time","active"]
    for field in fieldsToInclude
      @minimallyStoreField participantData, field, simpleData
    # only store session plan upon start or resume
    #if experimentState is "experimentStart" or experimentState is "experimentResume"
    #  @minimallyStoreField participantData, "current_session_plan", simpleData
    simpleData

  # update simpleData with a simplified version of this field's original data
  minimallyStoreField: (originalData, fieldname, simpleData) ->
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
    if fieldname of originalData
      compressedFieldname = fieldname
      if fieldname of fieldnameShorteningMap
        compressedFieldname = fieldnameShorteningMap[fieldname]
      compressedValue = JSON.parse(JSON.stringify(originalData[fieldname])) # deep clone
      if compressedValue
        if typeof compressedValue is 'string'
          compressedValue = @replaceAllSubStringsByRegEx compressedValue, valueCompressionMap
        else if typeof compressedValue is 'object'
          for subValue, index in compressedValue
            compressedSubValue = subValue
            if typeof subValue is 'string'
              compressedSubValue = @replaceAllSubStringsByRegEx subValue, valueCompressionMap
            compressedValue[index] = compressedSubValue
      simpleData[compressedFieldname] = compressedValue
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
        if DEBUG
          console.log "Too much data to post to Geordi (length #{jsonString.length}) even when simplified: "
          console.log simplifiedData
        jsonString = JSON.stringify {
          error: "too_much_data"
          details: "The data passed to Geordi was too large to store, at #{jsonString.length} characters (maximum is 512)."
        }
      jsonString
    else
      null

  changeState: (triggeringEvent) ->
    nextStateFor = {
      classificationStart: @EXPERIMENT_STATE_CLASSIFYING # (from WHATS_NEXT or POST_CLASSIFY)
      classificationEnd: @EXPERIMENT_STATE_POST_CLASSIFY # (from CLASSIFYING)
      interventionStart: @EXPERIMENT_STATE_INTERVENTION_ON_SCREEN # (from POST_CLASSIFY)
      interventionEnd: @EXPERIMENT_STATE_WHATS_NEXT # (from INTERVENTION_ON_SCREEN)
      experimentStart: @EXPERIMENT_STATE_POST_CLASSIFY # (from null)
      experimentResume: @EXPERIMENT_STATE_POST_CLASSIFY # (from null)
      experimentEnd: @EXPERIMENT_STATE_FINISHED # (from anywhere)
      # interventionDetected doesn't change the state
    }
    if triggeringEvent of nextStateFor
      @currentExperimentState = nextStateFor[triggeringEvent]

  # experimentState is "experimentStart", "classificationStart", "classificationEnd", "interventionStart", "interventionEnd"
  logExperimentState: (geordi, participantData, experimentState) ->
    @changeState experimentState
    simpleData = null
    if participantData?
      simpleData = @simplifyParticipantDataForLogging participantData, experimentState
    geordi.logEvent
      type: experimentState
      relatedID: "experimentState"
      data: @safeJSON simpleData

  # log some experimental data to geordi, with the specified event type
  logExperimentData: (geordi, eventType, eventData) ->
    geordi.logEvent {
      type: eventType
      relatedID: "experimentData",
      data: JSON.stringify(eventData)
    }
         
  # check if this project has an experiment enabled. Return experiment_name if so.
  #
  # (If it does, it should be notifying experiment server of its classifications, 
  #  which will register it or progress it)
  checkForExperiment: (projectSlug) ->
    enabledExperiments = @getEnabledExperiments()
    if projectSlug of enabledExperiments
      enabledExperiments[projectSlug]

  # type = "classification" or "intervention" (corresponding to Experiment Server endpoints)
  # id is the classification_id or intervention_id correspondingly
  postDataToExperimentServer: (interventionMonitor, geordi, experimentName, userID, sessionID, resourceType, id) ->
    @ensureEnvironmentSet()

    if not sessionID?
      sessionID = getSessionID()

    postPath = "/experiment/#{experimentName}/user/#{userID}/session/#{sessionID}/#{resourceType}/#{id}"
    postURL = "#{@EXPERIMENT_SERVER_URL_TO_USE}#{postPath}"
    fetch postURL, {
      method: 'POST'
      headers: new Headers()
      mode: 'cors'
      cache: 'default'
    }
    .then (response) =>
      if response.ok
        if DEBUG then console.log "Successful post to Experiment Server #{postURL}: #{response.status} #{response.statusText}"
        geordiEventType = "#{resourceType}End"
        @logExperimentState geordi, interventionMonitor?.latestFromSugar, geordiEventType # "interventionEnd" or "classificationEnd"
      else
        if DEBUG then console.log "Error posting to Experiment Server: #{response.status} #{response.statusText}"
        #TODO log Experiment Error

  optOutThisUser: (interventionMonitor, geordi, experimentName, userID) ->
    postPath = "/users/#{userID}/optout"
    postURL = "#{@EXPERIMENT_SERVER_URL_TO_USE}#{postPath}"
    params = new URLSearchParams()
    params.append 'experiment_name', experimentName
    params.append 'user_id', userID
    params.append 'project', @getProjectSlugForExperiment experimentName
    fetch postURL, {
      method: 'POST'
      body: params
      headers: new Headers()
      mode: 'cors'
      cache: 'default'
    }
    .then (response) =>
      if response.ok
        if DEBUG then console.log "Successful opt out posted to Experiment Server #{postURL}: #{response.status} #{response.statusText}"
        @logExperimentState geordi, interventionMonitor?.latestFromSugar, "experimentOptOut"
      else
        if DEBUG then console.log "Error posting opt out to Experiment Server: #{response.status} #{response.statusText}"
        #TODO log Experiment Error
      interventionMonitor.clearSugarLatest()

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
            if sugarData["intervention_time"]
              if "next_event" of sugarData
                interventionID = sugarData["next_event"]
                @getInterventionFromConfig projectSlug, experimentName, interventionID
        else
          console.log "Intervention Requested for Unsupported Experiment '#{experimentName}'"

module.exports = new ExperimentsClient