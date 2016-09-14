React = require 'react'
interventionMonitor = require './intervention-monitor'
experimentsClient = require './experiments-client'
config = require './intervention-config'
{getSessionID} = require '../lib/session'

Intervention = React.createClass

  contextTypes:
    geordi: React.PropTypes.object

  propTypes:
    experimentName: React.PropTypes.string.isRequired
    sessionID: React.PropTypes.string.isRequired
    interventionID: React.PropTypes.string.isRequired
    interventionDetails: React.PropTypes.object.isRequired

  endIntervention: ->
    experimentsClient.postDataToExperimentServer interventionMonitor,
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
    experimentsClient.logExperimentData @context.geordi, 'skipIntervention', logData
    @endIntervention()

  answerQuestion: (event) ->
    logData = {
      sessID: @props.sessionID
      ivnID: @props.interventionID
      answer: document.getElementsByClassName("intervention-question")[0].value
    }
    experimentsClient.logExperimentData @context.geordi, 'interventionResponse', logData
    @endIntervention()
    event.target.disabled = true
    event.preventDefault()

  endStatement: (event) ->
    @endIntervention()
    event.target.disabled = true
    event.preventDefault()

  componentWillMount: ->
    if experimentsClient.currentExperimentState isnt experimentsClient.EXPERIMENT_STATE_INTERVENTION_ON_SCREEN
      experimentsClient.logExperimentState @context.geordi, interventionMonitor?.latestFromSugar, "interventionStart"

  getBodyMarkup: (html) ->
    { __html: html }

  logLinkClick: (event) ->
    logData = {
      sessID: @props.sessionID
      ivnID: @props.interventionID
      linkAddress: event.target.getAttribute("href")
    }
    experimentsClient.logExperimentData @context.geordi, 'interventionLinkClicked', logData

  componentDidMount: ->
    interventionBody = document.getElementsByClassName("intervention-body")[0]
    linksInInterventions = interventionBody.getElementsByTagName("a")
    for link in linksInInterventions
      link.addEventListener("click", @logLinkClick)

  render: ->
    <form className="intervention">
      <h3 className="intervention-title">{@props.interventionDetails.title}:</h3>
      <p dangerouslySetInnerHTML={@getBodyMarkup(@props.interventionDetails.body)} className="intervention-body"/>
      {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
        <textarea placeholder="Enter your answer here" className="intervention-question"/>}
      <hr/>
      <nav className="task-nav">
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
          <button type="submit" onClick={@endStatement} className="intervention-ok continue major-button">
            <span>Continue</span>
          </button>}
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
          <span>
            <button type="button" onClick={@skipIntervention} className="intervention-cancel back minor-button">
              <span>Skip this question</span>
            </button>
            <button type="submit" onClick={@answerQuestion} className="intervention-submit continue major-button">
              <span>Submit my answer</span>
            </button>
          </span>}
      </nav>
    </form>

module.exports = Intervention