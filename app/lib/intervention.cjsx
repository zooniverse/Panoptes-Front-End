React = require 'react'
interventionMonitor = require './intervention-monitor'
experimentsClient = require './experiments-client'
config = require './intervention-config'
{getSessionID} = require '../lib/session'
Dialog = require 'modal-form/dialog'
{Link} = require 'react-router'

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

  optOut: ->
    console.log "opt out"

  componentDidMount: ->
    interventionBody = document.getElementsByClassName("intervention-body")[0]
    linksInInterventions = interventionBody.getElementsByTagName("a")
    for link in linksInInterventions
      link.addEventListener("click", @logLinkClick)

  render: ->
    <Dialog style={maxWidth: '30%', paddingLeft: '1.2em', paddingRight: '1.2em', top: '20%'} tag="form" className="intervention" closeButton={true} onCancel={@skipIntervention}>
      <h3 style={paddingTop: '0.7em'} className="intervention-title">{@props.interventionDetails.title}:</h3>
      <p dangerouslySetInnerHTML={@getBodyMarkup(@props.interventionDetails.body)} className="intervention-body"/>
      {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
        <textarea style={width: '95%', height:'5em', padding:'0.5em', lineHeight: '1.35em', fontSize:'medium'} placeholder="Enter your answer here" className="intervention-question"/>}
      <nav className="task-nav" style={textAlign:"center",paddingBottom:'1em',paddingTop:'1.3em'}>
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
          <button type="submit" onClick={@endStatement} className="intervention-ok continue major-button" style={margin: "0 auto"}>
              <span>Continue</span>
          </button>}
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
          <span style={margin: "0 auto"}>
            <button type="button" onClick={@skipIntervention} className="intervention-cancel standard-button">
              <span>Skip this question</span>
            </button>
            <button style={marginLeft: "1em"} type="submit" onClick={@answerQuestion} className="intervention-submit continue major-button">
              <span>Submit my answer</span>
            </button>
          </span>}
      </nav>
      <hr/>
      <p className="interventions-info" style={fontSize: 'x-small'}>
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
          <span>
            We are showing you this message as a trial of a new feature which aims to make your experience on Zooniverse projects like Comet Hunters more interesting and enjoyable.
            If you would prefer not to receive messages like this, you can <a style={cursor:'pointer'} onClick={@optOut}>click here to opt-out</a> from all future messages.
          </span>}
        {if @props.interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
          <span>
            We are asking you this question as a part of an initiative to make volunteers' experiences on Zooniverse projects like Comet Hunters more interesting and enjoyable.
            If you would prefer not to receive questions like this, you can <a style={cursor:'pointer'} onClick={@optOut}>click here to opt-out</a> from all future questions.
          </span>}
      </p>
    </Dialog>

module.exports = Intervention