React = require 'react'
Dialog = require 'modal-form/dialog'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

`import StepThrough from '../components/step-through';`

completedThisSession = {}
window?.tutorialsCompletedThisSession = completedThisSession

module.exports = React.createClass
  displayName: 'Tutorial'

  statics:
    find: (workflow) ->
      # Prefer fetching the tutorial for the workflow, if a workflow is given.
      if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id
          .then (tutorials) ->
            # Backwards compatibility for null kind values. We assume these are standard tutorials.
            onlyStandardTutorials = tutorials.filter (tutorial) ->
              tutorial.kind in ['tutorial', null]
            onlyStandardTutorials[0]
      else
        Promise.resolve()

    startIfNecessary: (tutorial, user, preferences, geordi) ->
        if tutorial?
          @checkIfCompleted(tutorial, user, preferences).then (completed) =>
            unless completed
              @start tutorial, user, preferences, geordi

    checkIfCompleted: (tutorial, user, preferences) ->
      if user?
        window.prefs = preferences
        Promise.resolve preferences?.preferences?.tutorials_completed_at?[tutorial.id]?
      else
        Promise.resolve completedThisSession[tutorial.id]?

    start: (tutorial, user, preferences, geordi) ->
      TutorialComponent = this

      if tutorial.steps.length isnt 0
        awaitTutorialMedia = tutorial.get 'attached_images'
          .catch ->
            # Checking for attached images throws if there are none.
            []
          .then (mediaResources) ->
            mediaByID = {}
            for mediaResource in mediaResources
              mediaByID[mediaResource.id] = mediaResource
            mediaByID

        awaitTutorialMedia.then (mediaByID) =>
          Dialog.alert(<TutorialComponent tutorial={tutorial} media={mediaByID} preferences={preferences} user={user} geordi={geordi} />, {
            className: 'tutorial-dialog',
            required: true,
            closeButton: true
          })
            .catch =>
              null # We don't really care if the user canceled or completed the tutorial.

  propTypes:
    geordi: React.PropTypes.object
    preferences: React.PropTypes.shape
      preferences: React.PropTypes.object
    tutorial: React.PropTypes.shape
      steps: React.PropTypes.arrayOf React.PropTypes.shape
        media: React.PropTypes.string
        content: React.PropTypes.string
    user: React.PropTypes.object

  getDefaultProps: ->
    geordi: {}
    media: {}
    preferences: null
    tutorial: {}
    user: null

  componentWillUnmount: ->
    @handleUnmount()

  render: ->
    isIE = 'ActiveXObject' of window
    if isIE
      tutorialStyle = height: '85vh'
    <StepThrough ref="stepThrough" className="tutorial-steps" style={tutorialStyle}>
      {for step, i in @props.tutorial.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={@props.media[step.media]?.src}>
          <Markdown>{step.content}</Markdown>
          <hr />
          <p style={textAlign: 'center'}>
            {if i is @props.tutorial.steps.length - 1
              <button type="submit" className="major-button">Let’s go!</button>
            else
              <button type="button" className="standard-button" onClick={@handleNextClick}>Continue</button>}
          </p>
        </MediaCard>}
    </StepThrough>

  handleNextClick: ->
    @refs.stepThrough.goNext()

  handleUnmount: ->
    now = new Date().toISOString()
    completedThisSession[@props.tutorial.id] = now

    if @props.user?
      projectPreferences = @props.preferences
      # Build this manually. Having an index (even as a strings) keys creates an array.
      projectPreferences.preferences ?= {}
      projectPreferences.preferences.tutorials_completed_at ?= {}
      projectPreferences.update "preferences.tutorials_completed_at.#{@props.tutorial.id}": now
      projectPreferences.save()

      @logToGeordi now

  logToGeordi: (datetime) ->
    @props.geordi.logEvent {
      type: "tutorial-completion"
      data: {
        tutorial: @props.tutorial.id
        tutorialCompleted: datetime
      }
    }
