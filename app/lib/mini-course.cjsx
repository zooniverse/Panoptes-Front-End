React = require 'react'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

completedThisSession = {}
window?.tutorialsCompletedThisSession = completedThisSession

module.exports = React.createClass
  displayName: 'MiniCourse'

  statics:
    find: ({workflow, project}) ->
      # Prefer fetching the tutorial for the workflow, if a workflow is given.
      awaitMiniCourseForWorkflow = if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id, kind: "mini-course"
          .then ([minicourse]) ->
            minicourse
      else
        Promise.resolve()

      # Wait for the workflow tutorial, but if nothing comes back, check for a project tutorial.
      awaitMiniCourseInGeneral = awaitMiniCourseForWorkflow.then (miniCourseForWorkflow) ->
        if miniCourseForWorkflow?
          miniCourseForWorkflow
        else if project?
          apiClient.type('tutorials').get project_id: project.id
            .then ([minicourse]) =>
              minicourse
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

    start: (minicourse, user) ->
      MiniCourseComponent = this
      preferences = null

      if user?
        minicourse.get('project').then (project) ->
          user.get('project_preferences', project_id: project.id).then ([projectPreferences]) ->
            preferences = projectPreferences

      if minicourse.steps.length isnt 0
        awaitMiniCourseMedia = minicourse.get 'attached_images'
          .catch ->
            # Checking for attached images throws if there are none.
            []
          .then (mediaResources) ->
            mediaByID = {}
            for mediaResource in mediaResources
              mediaByID[mediaResource.id] = mediaResource
            mediaByID

        awaitMiniCourseMedia.then (mediaByID) =>
          Dialog.alert(<MiniCourseComponent id={minicourse.id} projectPreferences={preferences} steps={minicourse.steps} media={mediaByID} />, {
            className: 'tutorial-dialog', #reusing tutorial styling
            required: true,
            closeButton: true
          })
            .catch =>
              null # We don't really care if the user canceled or completed the tutorial.
            .then =>
              @markPreferences preferences, minicourse, user


    markPreferences: (projectPreferences, minicourse, user) -> 
      defaultPreferences = { "preferences.minicourse_opt_out.#{minicourse.id}": false, "preferences.slide_last_seen.#{minicourse.id}": 0 }
      
      if user?
        if projectPreferences.preferences.minicourse_opt_out?[minicourse.id] # user is restarting via mini-course button
          projectPreferences.update defaultPreferences
          projectPreferences.save()
        else
          projectPreferences ?= apiClient.type('project_preferences').create({
            links: {
              project: project.id
            },
            preferences: {}
          })
          projectPreferences.update defaultPreferences
          # projectPreferences.update 'preferences.mini_course_completed_at': now
          projectPreferences.save()

    startIfNecessary: ({workflow, project, user}) ->
      @find({workflow, project}).then (minicourse) =>
        if minicourse?
          @checkIfCompleted(tutorial, user).then (completed) =>
            console.log {completed}
            unless completed
              @start minicourse, user unless projectPreferences.preferences.minicourse_opt_out["#{minicourse.id}"]

  propTypes:
    steps: React.PropTypes.arrayOf React.PropTypes.shape
      media: React.PropTypes.string
      content: React.PropTypes.string

  getDefaultProps: ->
    steps: []
    media: {}

  componentWillUnmount: ->
    if @props.projectPreferences.preferences.slide_last_seen[@props.id] < @props.steps.length
      nextSlideIndex = @props.projectPreferences.preferences.slide_last_seen[@props.id] + 1
    @props.projectPreferences.update "preferences.slide_last_seen.#{@props.id}": nextSlideIndex
    @props.projectPreferences.save()
  
  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps" defaultStep={@props.projectPreferences?.slide_last_seen[@props.id] || 0}>
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
    @props.projectPreferences.update "preferences.minicourse_out_out.#{@props.id}": true
    @props.projectPreferences.save()
