React = require 'react'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

completedThisSession = {}
window?.tutorialsCompletedThisSession = completedThisSession

module.exports = React.createClass
  displayName: 'Tutorial'

  statics:
    find: ({workflow, project}) ->
      # Prefer fetching the tutorial for the workflow, if a workflow is given.
      awaitTutorialForWorkflow = if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id
          .then ([tutorial]) ->
            # Backwards compatibility for null kind values. We assume these are standard tutorials.
            tutorial if tutorial?.kind is 'tutorial' or tutorial?.kind is null
      else
        Promise.resolve()

      # Wait for the workflow tutorial, but if nothing comes back, check for a project tutorial.
      # Keeping this fetch for now, but we should eventually take this out:
      awaitTutorialInGeneral = awaitTutorialForWorkflow.then (tutorialForWorkflow) ->
        if tutorialForWorkflow?
          tutorialForWorkflow
        else if project?
          apiClient.type('tutorials').get project_id: project.id
            .then ([tutorial]) =>
              # Backwards compatibility for null kind values. We assume these are standard tutorials.
              tutorial if tutorial?.kind is 'tutorial' or tutorial?.kind is null
        else
          # There's no workflow tutorial and no project given.
          Promise.resolve()

    startIfNecessary: ({workflow, project, user}) ->
      @find({workflow, project}).then (tutorial) =>
        if tutorial?
          @checkIfCompleted(tutorial, user).then (completed) =>
            console.log {completed}
            unless completed
              @start tutorial, user

    checkIfCompleted: (tutorial, user) ->
      if user?
        tutorial.get('project').then (project) =>
          user.get 'project_preferences', project_id: project.id
            .catch =>
              []
            .then ([projectPreferences]) =>
              window.prefs = projectPreferences
              projectPreferences?.preferences?.tutorials_completed_at?[tutorial.id]?
      else
        Promise.resolve completedThisSession[tutorial.id]?

    start: (tutorial, user) ->
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
          Dialog.alert(<TutorialComponent steps={tutorial.steps} media={mediaByID} />, {
            className: 'tutorial-dialog',
            required: true,
            closeButton: true
          })
            .catch =>
              null # We don't really care if the user canceled or completed the tutorial.
            .then =>
              @markComplete tutorial, user

    markComplete: (tutorial, user) ->
      now = new Date().toISOString()
      completedThisSession[tutorial.id] = now

      if user?
        tutorial.get('project').then (project) ->
          user.get('project_preferences', project_id: project.id).then ([projectPreferences]) ->
            projectPreferences ?= apiClient.type('project_preferences').create
              links:
                project: project.id
              preferences: {}
            # Build this manually. Having an index (even as a strings) keys creates an array.
            projectPreferences.preferences ?= {}
            projectPreferences.preferences.tutorials_completed_at ?= {}
            projectPreferences.update "preferences.tutorials_completed_at.#{tutorial.id}": now
            projectPreferences.save()

  propTypes:
    steps: React.PropTypes.arrayOf React.PropTypes.shape
      media: React.PropTypes.string
      content: React.PropTypes.string

  getDefaultProps: ->
    steps: []
    media: {}

  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps">
      {for step, i in @props.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={@props.media[step.media]?.src}>
          <Markdown>{step.content}</Markdown>
          <hr />
          <p style={textAlign: 'center'}>
            {if i is @props.steps.length - 1
              <button type="submit" className="major-button">Let’s go!</button>
            else
              <button type="button" className="standard-button" onClick={@handleNextClick}>Continue</button>}
          </p>
        </MediaCard>}
    </StepThrough>

  handleNextClick: ->
    @refs.stepThrough.goNext()
