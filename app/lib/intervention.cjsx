React = require 'react'
InterventionMonitor = require './intervention-monitor'
config = require './experiments-config'

Intervention = React.createClass

  contextTypes:
    interventionMonitor: React.PropTypes.object

  getInitialState: ->
    latestFromSugar: null

  cancelIntervention: (event) ->
    # TODO cancel properly
    @endIntervention(event)

  endIntervention: (event) ->
    experiment_name = event.target.attributes.getNamedItem("data-experiment-name").value
    user_id = event.target.attributes.getNamedItem("data-user-id").value
    session_id = event.target.attributes.getNamedItem("data-session-id").value
    intervention_id = event.target.attributes.getNamedItem("data-next-event").value
    type = "intervention"
    experimentsClient.postDataToExperimentServer(experiment_name, user_id, session_id, type, intervention_id)
    @context.interventionMonitor?

  render: ->
    if @context.interventionMonitor?.latestFromSugar
      experiment_name = @context.interventionMonitor?.latestFromSugar["experiment_name"]
      user_id = @props.user.id
      session_id = getSessionID()
      intervention_id = @context.interventionMonitor?.latestFromSugar["next_event"]
      intervention_details = experimentsClient.constructInterventionFromSugarData(@context.interventionMonitor?.latestFromSugar)
    if intervention_details
      <div className="intervention">
        <h3 className="intervention-title">{intervention_details.title}:</h3>
        <p className="intervention-body">{intervention_details.body}</p>
        {if intervention_details.type==config.INTERVENTION_TYPES.QUESTION
          <textarea placeholder="Enter your answer here" className="intervention-question"/>}
        <hr/>
        <nav className="task-nav">
          {if intervention_details.type==config.INTERVENTION_TYPES.STATEMENT
            <button type="button" onClick={@endIntervention} data-experiment-name="#{experiment_name}" data-user-id="#{user_id}" data-session-id="#{session_id}" data-next-event="#{intervention_id}" className="intervention-ok continue major-button">
              <span>Continue</span>
            </button>}
          {if intervention_details.type==config.INTERVENTION_TYPES.QUESTION
            <span>
              <button type="button" onClick={@cancelIntervention} data-experiment-name="#{experiment_name}" data-user-id="#{user_id}" data-session-id="#{session_id}" className="intervention-cancel back minor-button">
                <span>Skip this question</span>
              </button>
              <button type="button" onClick={@endIntervention} data-experiment-name="#{experiment_name}" data-user-id="#{user_id}" data-session-id="#{session_id}" data-next-event="#{intervention_id}" className="intervention-submit continue major-button">
                <span>Submit my answer</span>
              </button>
            </span>}
        </nav>
      </div>
    else
      <span/>

module.exports = Intervention