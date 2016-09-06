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

  lookupProjectSlug: (enabled_experiments, experiment_name) ->
    this_project_slug for this_project_slug, experiments_for_this_slug of enabled_experiments when experiment_name in experiments_for_this_slug

  getProjectSlugForExperiment: (experiment_name) ->
    @ensureEnvironmentSet()
    switch @EXPERIMENT_SERVER_URL_TO_USE
      when @EXPERIMENT_SERVER_PRODUCTION_URL
        @lookupProjectSlug config.ENABLED_EXPERIMENTS_PRODUCTION, experiment_name
      else
        @lookupProjectSlug config.ENABLED_EXPERIMENTS_STAGING, experiment_name

  # At the start (or resume) of an experiment, make sure geordi gets updated.
  #
  # (Note: for experiments that have a separate "registration" before first event, this would also be the place
  # that we would do that POST to the experiment server
  # - this isn't currently done here as we don't have an experiment that needs registration)
  #
  startOrResumeExperiment: (interventionMonitor, geordi) ->
    if interventionMonitor?.latestFromSugar and interventionMonitor?.latestFromSugar["active"]
      experiment_name = interventionMonitor?.latestFromSugar["experiment_name"]
      cohort = interventionMonitor?.latestFromSugar["cohort"]
      @logExperimentState geordi, "experimentStartOrResume", interventionMonitor?.latestFromSugar
      # TODO check geordi experiment value - if it was null, log an experimentStart event else log a resume event.
      geordi?.remember
        experiment: experiment_name
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
    fields_to_include = ["current_session_id","current_session_history","current_session_plan","seq_of_next_event","next_event","intervention_time","active"]
    fieldname_shortening_map = {
      current_session_id: "sessID"
      current_session_history: "hist"
      current_session_plan: "plan"
      seq_of_next_event: "next_evt_pos"
      intervention_time: "ivn_next"
    }
    value_compression_map = {
      intervention: "i"
      classification: "c"
      "-question-": "qu"
      "-statement-": "st"
      gamisation: "gam"
      valued: "val"
      learning: "lrn"
    }
    simple_data = {}
    for field in fields_to_include
      if field of data
        fieldname_to_use = field
        if field of fieldname_shortening_map
          fieldname_to_use = fieldname_shortening_map[field]
        value_to_use = JSON.parse(JSON.stringify(data[field])) # deep clone
        if typeof value_to_use is 'string'
          value_to_use = @replaceAllSubStringsByRegEx value_to_use, value_compression_map
        else if typeof value_to_use is 'object'
          for subvalue, index in value_to_use
            if typeof subvalue is 'string'
              value_to_use[index] = @replaceAllSubStringsByRegEx subvalue, value_compression_map
        simple_data[fieldname_to_use] = value_to_use
    simple_data

  replaceAllSubStringsByRegEx: (string_to_modify, value_compression_map) ->
    for regex_str, replacement of value_compression_map
      regex = new RegExp regex_str,"gi"
      string_to_modify = string_to_modify.replace regex, replacement
    string_to_modify

  # .. and if it's too long, we give up.
  safeJSON: (simplified_data) ->
    if simplified_data
      jsonString = JSON.stringify(simplified_data)
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
    simple_data = null
    if data?
      simple_data = @simplifyParticipantDataForLogging data
    geordi?.logEvent
      type: "experiment"
      relatedID: experimentState
      data: @safeJSON simple_data

  # check if this project has an experiment enabled. Return experiment_name if so.
  #
  # (If it does, it should be notifying experiment server of its classifications, 
  #  which will register it or progress it)
  checkForExperiment: (project_slug) ->
    enabled_experiments = @getEnabledExperiments()
    if project_slug of enabled_experiments
      enabled_experiments[project_slug]

  # type = "classification" or "intervention", and id is the classification_id or intervention_id correspondingly
  postDataToExperimentServer: (interventionMonitor, geordi, experiment_name, user_id, session_id, type, id) ->
    @ensureEnvironmentSet()

    if not session_id?
      session_id = getSessionID()

    post_path = "/experiment/#{experiment_name}/user/#{user_id}/session/#{session_id}/#{type}/#{id}"
    post_url = "#{@EXPERIMENT_SERVER_URL_TO_USE}#{post_path}"

    request = new XMLHttpRequest()
    request.open 'POST', post_url, true
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

  getInterventionFromConfig: (project_slug, experiment_name, intervention_id) ->
    enabled_experiments = @getEnabledExperiments()
    intervention_details = @getInterventionDetails()
    if experiment_name in enabled_experiments[project_slug] and project_slug of intervention_details
      if experiment_name of intervention_details[project_slug]
        if intervention_id of intervention_details[project_slug][experiment_name]
          intervention_details[project_slug][experiment_name][intervention_id]

  constructInterventionFromSugarData: (sugar_data) ->
    if "experiment_name" of sugar_data
      experiment_name = sugar_data["experiment_name"]
      project_slug = @getProjectSlugForExperiment(experiment_name)
      switch experiment_name
        when config.COMET_HUNTERS_VOLCROWE_EXPERIMENT
          if "intervention_time" of sugar_data
            if sugar_data["intervention_time"]==true
              if "next_event" of sugar_data
                intervention_id = sugar_data["next_event"]
                @getInterventionFromConfig project_slug, experiment_name, intervention_id
        else
          console.log "Intervention Requested for Unsupported Experiment '#{experiment_name}'"

module.exports = ExperimentsClient