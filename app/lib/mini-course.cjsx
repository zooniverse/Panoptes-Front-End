React = require 'react'
ReactDOM = require 'react-dom'
Dialog = require 'modal-form/dialog'
StepThrough = require '../components/step-through'
MediaCard = require '../components/media-card'
{Markdown} = require 'markdownz'
apiClient = require 'panoptes-client/lib/api-client'

minicoursesCompletedThisSession = {}
window?.minicoursesCompletedThisSession = minicoursesCompletedThisSession

# Note: We may add logic to handle non-signed-in users.
# For now, will move forward with the mini-course working only for signed-in users.

module.exports = React.createClass
  displayName: 'MiniCourse'

  statics:
    find: ({workflow}) ->
      # Prefer fetching the tutorial for the workflow, if a workflow is given.
      if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id, kind: "mini-course"
          .then ([minicourse]) ->
            minicourse
      else
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
              className: 'mini-course-dialog', #reusing tutorial styling
              required: true,
              closeButton: true
              onSubmit: @handleOptOut.bind(null, project, user, minicourse.id)
              onCancel: @handleOnCancel
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
            if projectPreferences?.preferences.minicourses?
              projectPreferences.update resetPreferences
              projectPreferences.save().then =>
                @start minicourse, user
            else
              # Create default preferences if they don't exist
              @createProjectPreferences(projectPreferences, minicourse.id, project.id).then =>
                @start minicourse, user

    startIfNecessary: ({workflow, project, user}) ->
      if user?
        @find({workflow}).then (minicourse) =>
          if minicourse?
            @checkIfCompleted(minicourse, project, user).then (completed) =>
              unless completed
                user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
                  @start minicourse, user unless projectPreferences.preferences.minicourses?.opt_out["id_#{minicourse.id}"] 

    checkIfCompleted: (minicourse, project, user) ->
      if user?
        user.get 'project_preferences', project_id: project.id
          .catch =>
            []
          .then ([projectPreferences]) =>
            window.prefs = projectPreferences
            projectPreferences?.preferences?.minicourses?.completed_at?["id_#{minicourse.id}"]?

    handleOptOut: (project, user, minicourseID) ->
      if user?
        user.get('project_preferences', project_id: project.id).then ([projectPreferences]) =>
          projectPreferences.update "preferences.minicourses.opt_out.id_#{minicourseID}": true
          projectPreferences.save()

    handleOnCancel: ->
      console.log('cancel')
      return

    createProjectPreferences: (projectPreferences, minicourseID, projectID) ->
      defaultPreferences = { 
        "preferences.minicourses.opt_out.id_#{minicourseID}": false, 
        "preferences.minicourses.slide_to_start.id_#{minicourseID}": 0 
      }

      projectPreferences ?= apiClient.type('project_preferences').create({
        links: {
          project: projectID
        },
        preferences: {}
      })
      projectPreferences.update defaultPreferences
      projectPreferences.save()

  getDefaultProps: ->
    media: {}
    minicourse: {}
    project: {}
    user: {}

  getInitialState: ->
    optOutCheckbox: false
    projectPreferences: null
    slideToStart: 0

  componentDidMount: ->
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
          newProjectPreferences = @createProjectPreferences(projectPreferences, @props.minicourse.id, @props.project.id)
          @setState { projectPreferences: newProjectPreferences }
  
  componentWillUnmount: ->
    if @state.projectPreferences?
      @handleProjectPreferencesOnUnmount()
  
  render: ->
    <StepThrough ref="stepThrough" className="mini-course-dialog__steps">
      {for step, i in @props.minicourse.steps
        step._key ?= Math.random()
        <MediaCard key={step._key} className="steps__step" src={@props.media[step.media]?.src}>
          <Markdown>{step.content}</Markdown>
          <hr />
          <div className="steps__step-actions">
            <label className="action__opt-out">
              <input type="checkbox" onChange={@handleOptOutToggle} />
              Do not show me this again 
            </label>
            {if @state.optOutCheckbox
              <button type="submit" className="minor-button">Opt out <i className="fa fa-long-arrow-right fa-lg" aria-hidden="true"></i></button>
            else
              <button type="button" className="standard-button" onClick={@handleOnCancel}>Close</button>}
          </div>
        </MediaCard>}
    </StepThrough>

  handleOptOutToggle: (e) ->
    checked = e.target.checked
    console.log('handling', checked)

    if checked
      @setState optOutCheckbox: true
    else
      @setState optOutCheckbox: false

  handleProjectPreferencesOnUnmount: ->
    if @state.slideToStart is @props.minicourse.steps.length - 1
      now = new Date().toISOString()
      minicoursesCompletedThisSession[@props.minicourse.id] = now

      @state.projectPreferences.update "preferences.minicourses.completed_at.id_#{@props.minicourse.id}": now
      @state.projectPreferences.save()
    else
      nextSlide = @state.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"] + 1
      
      @state.projectPreferences.update "preferences.minicourses.slide_to_start.id_#{@props.minicourse.id}": nextSlide
      @state.projectPreferences.save()
