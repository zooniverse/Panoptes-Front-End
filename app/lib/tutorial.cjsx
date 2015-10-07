React = require 'react'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'

completedThisSession = {}

module.exports = React.createClass
  displayName: 'Tutorial'

  statics:
    checkIfCompleted: (user, project) ->
      getCompletedAt = if user?
        user.get 'project_preferences', project_id: project.id
          .catch =>
            []
          .then ([projectPreferences]) =>
            new Date projectPreferences?.preferences?.tutorial_completed_at
      else
        Promise.resolve new Date completedThisSession[project.id]

      getCompletedAt.then (completedAt) =>
        if isNaN completedAt.valueOf()
          false
        else
          # TODO: Check if the completion date is greater than the most recent tutorial_step's modified_at date.
          # Return `null` to mean "Completed, but not with the most recent version".
          true

    start: (user, project) ->
      # TODO: Fetch steps here, make sure they're in order.
      getSteps = Promise.resolve project.configuration.tutorial ? []

      doingTutorial = getSteps.then (steps) =>
        unless steps.length is 0
          Tutorial = this
          Dialog.alert <Tutorial steps={steps} />, className: 'tutorial-dialog'

      # We don't really care if the user canceled or completed the tutorial.
      doneDoingTutorial = doingTutorial.catch =>
        null

      doneDoingTutorial.then =>
        now = new Date().toISOString()
        if user?
          user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
            projectPreferences.update 'preferences.tutorial_completed_at': now
            projectPreferences.save()
        else
          completedThisSession[project.id] = now

    startIfNecessary: (user, project) ->
      @checkIfCompleted user, project
        .then (completed) =>
          if completed is false
            @start user, project

  propTypes:
    steps: React.PropTypes.arrayOf React.PropTypes.shape
      media: React.PropTypes.string
      content: React.PropTypes.string

  getDefaultProps: ->
    steps: []

  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps">
      {for step, i in @props.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={step.media}>
          <Markdown>{step.content}</Markdown>
          <hr key="hr" />
          <p key="p" style={textAlign: 'center'}>
            {if i is @props.steps.length - 1
              <button type="submit" className="major-button">Let’s go!</button>
            else
              <button type="button" className="standard-button" onClick={@handleNextClick}>Continue</button>}
          </p>
        </MediaCard>}
    </StepThrough>

  handleNextClick: ->
    @refs.stepThrough.goNext()
