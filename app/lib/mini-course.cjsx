React = require 'react'
ReactDOM = require 'react-dom'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

minicoursesCompletedThisSession = {}
window?.minicoursesCompletedThisSession = minicoursesCompletedThisSession

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
            Dialog.alert(<MiniCourseComponent project={project} user={user} minicourse={minicourse} media={mediaByID} />, {
              className: 'tutorial-dialog', #reusing tutorial styling
              required: true,
              closeButton: true
              onSubmit: @handleOptOut.bind(null, project, user, minicourse.id)
            })
              .catch =>
                null # We don't really care if the user canceled or completed the tutorial.

    restart: (minicourse, project, user) ->
      resetPreferences = { 
        "preferences.minicourses.opt_out.id_#{minicourse.id}": false, 
        "preferences.minicourses.slide_to_start.id_#{minicourse.id}": 0 
        "preferences.minicourses.completed_at.id_#{minicourse.id}": null
      }

      if user?
        user.get 'project_preferences', project_id: project.id
          .then ([projectPreferences]) =>
            window.prefs = projectPreferences
            if projectPreferences.preferences.minicourses?
              projectPreferences.update resetPreferences
              projectPreferences.save().then =>
                @start minicourse, user
      else
        sessionStorage.setItem 'minicourse_slide_to_start', 0

        @start minicourse, user

    startIfNecessary: ({workflow, project, user}) ->
      @find({workflow, project}).then (minicourse) =>
        if minicourse?
          @checkIfCompleted(minicourse, project, user).then (completed) =>
            unless completed
              if user?
                user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
                  @start minicourse, user unless projectPreferences.preferences.minicourses?.opt_out["id_#{minicourse.id}"]
              else
                @start minicourse, user 

    checkIfCompleted: (minicourse, project, user) ->
      if user?
        user.get 'project_preferences', project_id: project.id
          .catch =>
            []
          .then ([projectPreferences]) =>
            window.prefs = projectPreferences
            projectPreferences?.preferences?.minicourses?.completed_at?["id_#{minicourse.id}"]?
      else
        Promise.resolve minicoursesCompletedThisSession[minicourse.id]?

    handleOptOut: (project, user, minicourseID) ->
      if user?
        user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
          projectPreferences.update "preferences.minicourses.opt_out.id_#{minicourseID}": true
          projectPreferences.save()

  getDefaultProps: ->
    media: {}
    minicourse: {}
    project: {}
    user: {}

  getInitialState: ->
    projectPreferences: null
    slideToStart: 0

  componentDidMount: ->
    defaultPreferences = { 
      "preferences.minicourses.opt_out.id_#{@props.minicourse.id}": false, 
      "preferences.minicourses.slide_to_start.id_#{@props.minicourse.id}": 0 
    }

    if @props.user?
      @props.user.get('project_preferences', project_id: @props.project.id).then ([projectPreferences]) =>
        if projectPreferences.preferences.minicourses?
          @refs.stepThrough.goTo projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"]
          @setState { 
            slideToStart: projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"],
            projectPreferences 
          }
        else
          # Create default preferences
          projectPreferences ?= apiClient.type('project_preferences').create({
            links: {
              project: project.id
            },
            preferences: {}
          })
          projectPreferences.update defaultPreferences
          projectPreferences.save()
            .then =>
              @setState { projectPreferences }
    else
      if sessionStorage.getItem('minicourse_slide_to_start')?
        @refs.stepThrough.goTo sessionStorage.getItem('minicourse_slide_to_start')
  
  componentWillUnmount: ->
    if @state.projectPreferences?
      @handleProjectPreferencesOnUnmount()
    else
      now = new Date().toISOString()
      minicoursesCompletedThisSession[@props.minicourse.id] = now
      sessionStorage.setItem('minicourse_slide_to_start', @state.slideToStart + 1)
  
  render: ->
    <StepThrough ref="stepThrough" className="tutorial-steps">
      {for step, i in @props.minicourse.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="tutorial-step" src={@props.media[step.media]?.src}>
          <Markdown>{step.content}</Markdown>
          <hr />
          {if @props.user?
            <p style={textAlign: 'center'}>
              <button type="submit" className="standard-button">Opt Out</button>
            </p>}
        </MediaCard>}
    </StepThrough>

  handleProjectPreferencesOnUnmount: ->
    if @state.slideToStart is @props.minicourse.steps.length - 1
      now = new Date().toISOString()
      minicoursesCompletedThisSession[@props.minicourse.id] = now

      if @props.user?
        @state.projectPreferences.update "preferences.minicourses.completed_at.id_#{@props.minicourse.id}": now
        @state.projectPreferences.save()
    else
      nextSlide = @state.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"] + 1
      
      @state.projectPreferences.update "preferences.minicourses.slide_to_start.id_#{@props.minicourse.id}": nextSlide
      @state.projectPreferences.save()
