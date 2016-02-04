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
    checkIfCompleted: (user, project) ->
      getCompletedAt = if completedThisSession[project.id]?
        Promise.resolve new Date completedThisSession[project.id]
      else if user?
        user.get 'project_preferences', project_id: project.id
          .catch =>
            []
          .then ([projectPreferences]) =>
            new Date projectPreferences?.preferences?.tutorial_completed_at
      else
        Promise.resolve null

      getCompletedAt.then (completedAt) =>
        if isNaN completedAt?.valueOf()
          false
        else
          # TODO: Check if the completion date is greater than the tutorial's modified_at date.
          # Return `null` to mean "Completed, but not with the most recent version".
          true

    start: (user, project) ->
      apiClient.type('tutorials').get project_id: project.id
        .then ([tutorial]) =>
          if tutorial? and tutorial.steps.length isnt 0
            tutorial.get 'attached_images'
              .catch =>
                []
              .then (mediaResources) =>
                mediaByID = {}
                for mediaResource in mediaResources
                  mediaByID[mediaResource.id] = mediaResource

                TutorialComponent = this
                Dialog.alert(<TutorialComponent steps={tutorial.steps} media={mediaByID} />, {
                  className: 'tutorial-dialog',
                  required: true,
                  closeButton: true
                })
                  .catch =>
                    null # We don't really care if the user canceled or completed the tutorial.
                  .then =>
                    now = new Date().toISOString()
                    completedThisSession[project.id] = now
                    if user?
                      user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
                        projectPreferences ?= apiClient.type('project_preferences').create({
                          links: {
                            project: project.id
                          },
                          preferences: {}
                        })
                        projectPreferences.update 'preferences.tutorial_completed_at': now
                        projectPreferences.save()

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
