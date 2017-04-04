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
    project: React.PropTypes.object.isRequired
    user: React.PropTypes.object

  getInitialState: ->
    renderIntervention: false

  disableIntervention: ->
    @setState renderIntervention: false

  enableIntervention: ->
    experimentsClient.logExperimentState @context.geordi, interventionMonitor?.latestFromSugar, "interventionDetected"
    @setState renderIntervention: true

  endIntervention: ->
    experimentsClient.postDataToExperimentServer interventionMonitor,
                                                 @context.geordi,
                                                 interventionMonitor.latestFromSugar.experiment_name,
                                                 @props.user.id,
                                                 getSessionID(),
                                                 "intervention",
                                                 interventionMonitor.latestFromSugar.next_event

  skipIntervention: (event) ->
    logData = {
      sessID: getSessionID()
      ivnID: @props.interventionID
      cancelled: true
    }
    experimentsClient.logExperimentData @context.geordi, 'skipIntervention', logData
    @endIntervention()

  answerQuestion: (event) ->
    logData = {
      sessID: getSessionID()
      ivnID: @props.interventionID
      answer: @refs.question?.value
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
    interventionMonitor.setProjectSlug @props.project.slug
    if experimentsClient.currentExperimentState isnt experimentsClient.EXPERIMENT_STATE_INTERVENTION_ON_SCREEN
      experimentsClient.logExperimentState @context.geordi, interventionMonitor?.latestFromSugar, "interventionStart"


  componentDidMount: ->
    experimentsClient.startOrResumeExperiment interventionMonitor, @context.geordi
    @setState renderIntervention: interventionMonitor?.shouldShowIntervention()
    interventionMonitor.on 'interventionRequested', @enableIntervention
    interventionMonitor.on 'classificationTaskRequested', @disableIntervention

    linksInInterventions = @refs.body?.getElementsByTagName("a") || []
    for link in linksInInterventions
      link.addEventListener("click", @logLinkClick)

  componentWillUnmount: ->
    interventionMonitor.removeListener 'interventionRequested', @enableIntervention
    interventionMonitor.removeListener 'classificationTaskRequested', @disableIntervention

  getBodyMarkup: (html) ->
    { __html: html }

  logLinkClick: (event) ->
    logData = {
      sessID: getSessionID()
      ivnID: interventionMonitor.latestFromSugar.next_event
      linkAddress: event.target.getAttribute("href")
    }
    experimentsClient.logExperimentData @context.geordi, 'interventionLinkClicked', logData

  optOut: ->
    experimentsClient.optOutThisUser interventionMonitor, @context.geordi, interventionMonitor.latestFromSugar.experiment_name, @props.user.id
    @disableIntervention()

  render: ->
    if @state.renderIntervention
      interventionDetails = experimentsClient.constructInterventionFromSugarData(interventionMonitor.latestFromSugar)

      <Dialog style={maxWidth: '30%', paddingLeft: '1.2em', paddingRight: '1.2em', top: '20%'} tag="form" className="intervention" closeButton={true} onCancel={@skipIntervention}>
        <h3 style={paddingTop: '0.7em'} className="intervention-title">{interventionDetails.title}:</h3>
        <p ref="body" dangerouslySetInnerHTML={@getBodyMarkup(interventionDetails.body)} className="intervention-body"/>
        {if interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
          <textarea ref="question" style={width: '95%', height:'5em', padding:'0.5em', lineHeight: '1.35em', fontSize:'medium'} placeholder="Enter your answer here" className="intervention-question"/>}
        <div className="task-nav" style={textAlign:"center",paddingBottom:'1em',paddingTop:'1.3em'}>
          {if interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
            <button type="submit" onClick={@endStatement} className="intervention-ok continue major-button" style={margin: "0 auto"}>
                <span>Continue</span>
            </button>}
          {if interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
            <span style={margin: "0 auto"}>
              <button type="button" onClick={@skipIntervention} className="intervention-cancel standard-button">
                <span>Skip this question</span>
              </button>
              <button style={marginLeft: "1em"} type="submit" onClick={@answerQuestion} className="intervention-submit continue major-button">
                <span>Submit my answer</span>
              </button>
            </span>}
        </div>
        <hr/>
        <p className="interventions-info" style={fontSize: 'x-small'}>
          {if interventionDetails.type is config.INTERVENTION_TYPES.STATEMENT
            <span>
              We are showing you this message as a trial of a new feature which aims to make your experience on Zooniverse projects like Comet Hunters more interesting and enjoyable.
              If you would prefer not to receive messages like this, you can <a style={cursor:'pointer'} onClick={@optOut}>click here to opt-out</a> from all future messages.
            </span>}
          {if interventionDetails.type is config.INTERVENTION_TYPES.QUESTION
            <span>
              We are asking you this question as a part of an initiative to make volunteers' experiences on Zooniverse projects like Comet Hunters more interesting and enjoyable.
              If you would prefer not to receive questions like this, you can <a style={cursor:'pointer'} onClick={@optOut}>click here to opt-out</a> from all future questions.
            </span>}
        </p>
      </Dialog>
    else
      null

module.exports = Intervention