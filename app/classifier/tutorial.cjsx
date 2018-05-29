React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Dialog = require 'modal-form/dialog'
Translate = require 'react-translate-component'
MediaCard = require('../components/media-card').default
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'
{ Provider } = require('react-redux')

StepThrough = require('../components/step-through').default
Translations = require('./translations').default


completedThisSession = {}
window?.tutorialsCompletedThisSession = completedThisSession

module.exports = createReactClass
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

    startIfNecessary: (tutorial, user, preferences, geordi, store) ->
        if tutorial?
          @checkIfCompleted(tutorial, user, preferences).then (completed) =>
            unless completed
              @start tutorial, user, preferences, geordi, store

    checkIfCompleted: (tutorial, user, preferences) ->
      if user?
        window.prefs = preferences
        Promise.resolve preferences?.preferences?.tutorials_completed_at?[tutorial.id]?
      else
        Promise.resolve completedThisSession[tutorial.id]?

    start: (tutorial, user, preferences, geordi, store) ->
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
          tutorialContent =
            <Provider store={store}>
              <Translations original={tutorial} type="tutorial">
                <TutorialComponent tutorial={tutorial} media={mediaByID} preferences={preferences} user={user} geordi={geordi} />
              </Translations>
            </Provider>
          Dialog.alert(tutorialContent, {
            className: 'tutorial-dialog',
            required: true,
            closeButton: true
          })
            .catch (e) =>
              console.warn e
              null # We don't really care if the user canceled or completed the tutorial.

  propTypes:
    geordi: PropTypes.object
    preferences: PropTypes.shape
      preferences: PropTypes.object
    tutorial: PropTypes.shape
      steps: PropTypes.arrayOf PropTypes.shape
        media: PropTypes.string
        content: PropTypes.string
    translation: PropTypes.shape
      steps: PropTypes.arrayOf PropTypes.shape
        content: PropTypes.string
    user: PropTypes.object

  getDefaultProps: ->
    geordi: {}
    media: {}
    preferences: null
    tutorial: {}
    user: null

  componentWillMount: ->
    @previousActiveElement = document.activeElement

  componentWillUnmount: ->
    @handleUnmount()

  render: ->
    isIE = 'ActiveXObject' of window
    if isIE
      tutorialStyle = height: '85vh'
    <StepThrough ref={(component) => @stepThrough = component} className="tutorial-steps" style={tutorialStyle}>
      {for step, i in @props.tutorial.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={@props.media[step.media]?.src}>
          <Markdown>{@props.translation.steps[i].content}</Markdown>
          <hr />
          <p style={textAlign: 'center'}>
            {if i is @props.tutorial.steps.length - 1
              <button type="submit" className="major-button"><Translate content="classifier.letsGo" /></button>
            else
              <button type="button" className="standard-button" onClick={@handleNextClick}><Translate content="classifier.continue" /></button>}
          </p>
        </MediaCard>}
    </StepThrough>

  handleNextClick: ->
    @stepThrough.goNext()

  handleUnmount: ->
    @previousActiveElement?.focus()
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
