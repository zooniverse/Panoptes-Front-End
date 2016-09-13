React = require 'react'
InterventionMonitor = require './intervention-monitor'
ExperimentsClient = require './experiments-client'
config = require './intervention-config'
{getSessionID} = require '../lib/session'

Intervention = React.createClass

  contextTypes:
    geordi: React.PropTypes.object
    interventionMonitor: React.PropTypes.object
    experimentsClient: React.PropTypes.object

  propTypes:
    experimentName: React.PropTypes.string.isRequired
    sessionID: React.PropTypes.string.isRequired
    interventionID: React.PropTypes.string.isRequired
    interventionDetails: React.PropTypes.object.isRequired

  endIntervention: ->
    @context.experimentsClient.postDataToExperimentServer @context.interventionMonitor,
                                                 @context.geordi,
                                                 @props.experimentName,
                                                 @props.user.id,
                                                 @props.sessionID,
                                                 "intervention",
                                                 @props.interventionID

  skipIntervention: (event) ->
    logData = {
      sessID: @props.sessionID
      ivnID: @props.interventionID
      cancelled: true
    }
    @context.experimentsClient.logExperimentData @context.geordi, 'skipIntervention', logData
    @endIntervention()

  answerQuestion: (event) ->
    logData = {
      sessID: @props.sessionID
      ivnID: @props.interventionID
      answer: document.getElementsByClassName("intervention-question")[0].value
    }
    @context.experimentsClient.logExperimentData @context.geordi, 'interventionResponse', logData
    @endIntervention()
    event.target.disabled = true

  endStatement: (event) ->
    @endIntervention()
    event.target.disabled = true

  componentWillMount: ->
    if @context.experimentsClient.currentExperimentState isnt @context.experimentsClient.EXPERIMENT_STATE_INTERVENTION_ON_SCREEN
      @context.experimentsClient.logExperimentState @context.geordi, @context.interventionMonitor?.latestFromSugar, "interventionStart"

  render: ->
    <div className="intervention">
      <h3 className="intervention-title">{@props.interventionDetails.title}:</h3>
      <p className="intervention-body">{@props.interventionDetails.body}</p>
      {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
        <textarea placeholder="Enter your answer here" className="intervention-question"/>}
      <hr/>
      <nav className="task-nav">
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
          <button type="button" onClick={@endStatement} className="intervention-ok continue major-button">
            <span>Continue</span>
          </button>}
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
          <span>
            <button type="button" onClick={@skipIntervention} className="intervention-cancel back minor-button">
              <span>Skip this question</span>
            </button>
            <button type="button" onClick={@answerQuestion} className="intervention-submit continue major-button">
              <span>Submit my answer</span>
            </button>
          </span>}
      </nav>
    </div>

module.exports = Intervention