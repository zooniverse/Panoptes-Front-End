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
          apiClient.type('tutorials').get project_id: project.id, kind: "mini-course"
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

      if minicourse.steps.length isnt 0
        minicourse.get('project').then (project) =>
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
            Dialog.alert(<MiniCourseComponent project={project} user={user} steps={minicourse.steps} media={mediaByID} />, {
              className: 'tutorial-dialog', #reusing tutorial styling
              required: true,
              closeButton: true
            })
              .catch =>
                null # We don't really care if the user canceled or completed the tutorial.
              # .then =>
              #   console.log('then')
              #   @markPreferences project, minicourse.id, user

    markPreferences: (project, minicourseID, user) -> 
      if user?
        user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
          projectPreferences.update "preferences": null


    startIfNecessary: ({workflow, project, user}) ->
      @find({workflow, project}).then (minicourse) =>
        if minicourse?
          # @checkIfCompleted(minicourse, user).then (completed) =>
          #   console.log {completed}
          #   unless completed
          @start minicourse, user 

  propTypes:
    steps: React.PropTypes.arrayOf React.PropTypes.shape
      media: React.PropTypes.string
      content: React.PropTypes.string

  getDefaultProps: ->
    steps: []
    media: {}
    minicourseID: null
    project: {}
    user: {}

  getInitialState: ->
    slideToStart: 0

  componentWillMount: ->
    defaultPreferences = { "preferences.minicourses.opt_out.#{minicourseID}": false, "preferences.minicourses.slide_last_seen.#{minicourseID}": 0 }

    if @props.user
      user?.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
        # projectPreferences.update "preferences": null
        if projectPreferences.preferences.minicourses?
          if projectPreferences.preferences.minicourses.opt_out?["#{minicourseID}"] # user is restarting via mini-course button
            projectPreferences.update defaultPreferences
            projectPreferences.save()
          else if projectPreferences.preferences.minicourses.slide_last_seen["#{minicourseID}"]
            slideToStart = projectPreferences.preferences.minicourses.slide_last_seen["#{minicourseID}"]
        else
          # Create default preferences
          projectPreferences ?= apiClient.type('project_preferences').create({
            links: {
              project: project.id
            },
            preferences: {}
          })
          projectPreferences.update defaultPreferences
          # projectPreferences.update 'preferences.mini_course_completed_at': now
          projectPreferences.save()
    else
      slideToStart = 0

    @setState {slideToStart}
  
  componentWillUnmount: ->
    if @props.projectPreferences?
      if @props.projectPreferences.preferences.minicourses.slide_last_seen["#{@props.minicourseID}"] < @props.steps.length
        nextSlideIndex = @props.projectPreferences.preferences.minicourses.slide_last_seen["#{@props.minicourseID}"] + 1
        @props.projectPreferences.update "preferences.minicourses.slide_last_seen.#{@props.minicourseID}": nextSlideIndex
        @props.projectPreferences.save()
  
  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps" defaultStep={@state.slideToStart}>
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
    if @props.projectPreferences?
      @props.projectPreferences.update "preferences.minicourses.out_out.#{@props.minicourseID}": true
      @props.projectPreferences.save()
