React = require 'react'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

completedThisSession = {}
window?.tutorialsCompletedThisSession = completedThisSession

DEFAULT_PREFERENCES = { 'preferences.opt_out': false, 'preferences.slide_last_seen': 0 }

module.exports = React.createClass
  displayName: 'MiniCourse'

  statics:
    find: ({workflow, project}) ->
      # Prefer fetching the tutorial for the workflow, if a workflow is given.
      awaitTutorialForWorkflow = if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id
          .then ([tutorial]) ->
            tutorial
      else
        Promise.resolve()

      # Wait for the workflow tutorial, but if nothing comes back, check for a project tutorial.
      awaitTutorialInGeneral = awaitTutorialForWorkflow.then (tutorialForWorkflow) ->
        if tutorialForWorkflow?
          tutorialForWorkflow
        else if project?
          apiClient.type('tutorials').get project_id: project.id
            .then ([tutorial]) =>
              tutorial
        else
          # There's no workflow tutorial and no project given.
          Promise.resolve()

    checkIfCompleted: (projectPreferences) ->
      getCompletedAt = if completedThisSession[project.id]?
        Promise.resolve new Date completedThisSession[project.id]
      else if projectPreferences?
        new Date projectPreferences?.preferences?.mini_course_completed_at
      else
        Promise.resolve null

      getCompletedAt.then (completedAt) =>
        if isNaN completedAt?.valueOf()
          false
        else
          # TODO: Check if the completion date is greater than the minicourse's modified_at date.
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

                MiniCourseComponent = this
                Dialog.alert(<MiniCourseComponent steps={tutorial.steps} media={mediaByID} />, {
                  className: 'tutorial-dialog', #reusing tutorial styling
                  required: true,
                  closeButton: true
                })
                  .catch =>
                    null # We don't really care if the user canceled or completed the tutorial.
                  .then =>
                    # now = new Date().toISOString()
                    # completedThisSession[project.id] = now
                    if user?
                      user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
                        if projectPreferences.preferences.opt_out # user is restarting via mini-course button
                          projectPreferences.update DEFAULT_PREFERENCES
                          projectPreferences.save()
                        else
                          projectPreferences ?= apiClient.type('project_preferences').create({
                            links: {
                              project: project.id
                            },
                            preferences: {}
                          })
                          projectPreferences.update DEFAULT_PREFERENCES
                          # projectPreferences.update 'preferences.mini_course_completed_at': now
                          projectPreferences.save()

    fetchUserPreferences: (user, project) ->
      user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
        projectPreferences
      .catch =>
        null

    startIfNecessary: (user, project) ->
      projectPreferences = fetchUserPreferences user, project
      @checkIfCompleted projectPreferences
        .then (completed) =>
          if completed is false
            @start user, project unless projectPreferences.preferences.opt_out

  propTypes:
    steps: React.PropTypes.arrayOf React.PropTypes.shape
      media: React.PropTypes.string
      content: React.PropTypes.string

  getDefaultProps: ->
    steps: []
    media: {}

  getInitialState: ->
    projectPreferences: null

  componentDidMount: ->
    @setState projectPreferences: @fetchUserPreferences

  componentWillUnmount: ->
    if @state.projectPreferences.preferences.slide_last_seen < @props.steps.length
      nextSlideIndex = @state.projectPreferences.preferences.slide_last_seen + 1
    @state.projectPreferences.update 'preferences.slide_last_seen': nextSlideIndex
    @state.projectPreferences.save()
  
  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps" defaultStep={@state.projectPreferences?.slide_last_seen}>
      {for step, i in @props.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={@props.media[step.media]?.src}>
          <Markdown>{step.content}</Markdown>
          <hr />
          <p style={textAlign: 'center'}>
            <button type="button" className="standard-button" onClick={@handleOptOut}>Opt Out</button>
          </p>
        </MediaCard>}
    </StepThrough>

  handleNextClick: ->
    @refs.stepThrough.goNext()

  handleOptOut: ->
    @state.projectPreferences.update 'preferences.out_out': true
    @state.projectPreferences.save()
