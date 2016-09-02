config = require './experiments-config'
{getSessionID} = require '../lib/session'
DEBUG = false

class ExperimentsClient # Client for the ExperimentServer

  EXPERIMENT_SERVER_PRODUCTION_URL: "https://experiments.zooniverse.org"
  EXPERIMENT_SERVER_STAGING_URL: "https://experiments.staging.zooniverse.org"
  EXPERIMENT_SERVER_DEVELOPMENT_URL: "http://localhost:4567"
  EXPERIMENT_SERVER_URL_TO_USE: null
  
  ensureEnvironmentSet: ->
    if not @EXPERIMENT_SERVER_URL_TO_USE?
      if window.location.hostname=="www.zooniverse.org"
        @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_PRODUCTION_URL
      else if window.location.hostname=="localhost"
        @EXPERIMENT_SERVER_URL_TO_USE = @EXPERIMENT_SERVER_DEVELOPMENT_URL
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

  # check if this project has an experiment enabled. Return experiment_name if so.
  #
  # (If it does, it should be notifying experiment server of its classifications, 
  #  which will register it or progress it)
  checkForExperiment: (project_slug) ->
    enabled_experiments = @getEnabledExperiments()
    if project_slug of enabled_experiments
      enabled_experiments[project_slug]

  # type = "classification" or "intervention", and id is the classification_id or intervention_id correspondingly
  postDataToExperimentServer: (experiment_name, user_id, session_id, type, id) ->
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
    request.send()

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
            if sugar_data["intervention_time"]
              if "next_event" of sugar_data
                intervention_id = sugar_data["next_event"]
                @getInterventionFromConfig project_slug, experiment_name, intervention_id
        else
          console.log "Intervention Requested for Unsupported Experiment '#{experiment_name}'"

module.exports = ExperimentsClient