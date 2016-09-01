React = require 'react'
InterventionMonitor = require './intervention-monitor'
config = require './experiments-config'

Intervention = React.createClass

  contextTypes:
    interventionMonitor: React.PropTypes.object

  getInterventionDetails: (projectSlug, experimentName, interventionID) ->
    details = {}
    if experimentName in config.ENABLED_EXPERIMENTS[projectSlug] and projectSlug of config.INTERVENTION_DETAILS
      if experimentName of config.INTERVENTION_DETAILS[projectSlug]
        if interventionID of config.INTERVENTION_DETAILS[projectSlug][experimentName]
          details = config.INTERVENTION_DETAILS[projectSlug][experimentName][interventionID]
    details

  endIntervention: (cancelled=false) ->
    console.log "end Intervention"

  render: ->
    if @context.interventionMonitor?.latestFromSugar
      intervention_data = @context.interventionMonitor.latestFromSugar
      if "experiment_name" of intervention_data
        experiment_name = intervention_data["experiment_name"]
        if experiment_name == config.COMET_HUNTERS_VOLCROWE_EXPERIMENT
          if "seq_of_next_event" of intervention_data and "current_session_plan" of intervention_data
            next_event = intervention_data["current_session_plan"][intervention_data["seq_of_next_event"]]
            if next_event != config.CLASSIFICATION_MARKER
              intervention_details = @getInterventionDetails config.PROJECT_SLUGS.COMET_HUNTERS, experiment_name, next_event
    if intervention_details
      <div className="intervention">
        <h3 className="intervention-title">{intervention_details.title}:</h3>
        <p className="intervention-body">{intervention_details.body}</p>
        {if intervention_details.type==config.INTERVENTION_TYPES.QUESTION
          <textarea placeholder="Enter your answer here" className="intervention-question"/>}
        <hr/>
        <nav className="task-nav">
          {if intervention_details.type==config.INTERVENTION_TYPES.STATEMENT
            <button type="button" onClick={@endIntervention()} className="intervention-ok continue major-button">
              <span>OK</span>
            </button>}
          {if intervention_details.type==config.INTERVENTION_TYPES.QUESTION
            <span>
              <button type="button" onClick={@endIntervention(true)} className="intervention-cancel back minor-button">
                <span>Skip this question</span>
              </button>
              <button type="button" onClick={@endIntervention()} className="intervention-submit continue major-button">
                <span>Submit my answer</span>
              </button>
            </span>}
        </nav>
      </div>
    else
      <span/>

module.exports = Intervention