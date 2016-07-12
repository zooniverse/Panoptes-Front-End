React = require 'react'
Dialog = require 'modal-form/dialog'
MediaCard = require '../components/media-card'
{Markdown} = (require 'markdownz').default
apiClient = require 'panoptes-client/lib/api-client'

minicoursesCompletedThisSession = {}
window?.minicoursesCompletedThisSession = minicoursesCompletedThisSession

# Note: We may add logic to handle non-signed-in users.
# For now, will move forward with the mini-course working only for signed-in users.

module.exports = React.createClass
  displayName: 'MiniCourse'

  statics:
    find: ({workflow}) ->
      # Prefer fetching the tutorial for the workflow, so we know which one to fetch if multiple exist.
      if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id, kind: "mini-course"
          .then ([minicourse]) ->
            minicourse
      else
        Promise.resolve()

    start: (minicourse, projectPreferences, user) ->
      MiniCourseComponent = this
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
          Dialog.alert(<MiniCourseComponent projectPreferences={projectPreferences} user={user} minicourse={minicourse} media={mediaByID} />, {
            className: 'mini-course-dialog',
            required: true,
            closeButton: true,
            top: 0.2
          })
            .catch =>
              null # We don't really care if the user canceled or completed the tutorial.

    restart: (minicourse, projectPreferences, project, user) ->
      resetPreferences = {
        "preferences.minicourses.opt_out.id_#{minicourse.id}": false,
        "preferences.minicourses.slide_to_start.id_#{minicourse.id}": 0
        "preferences.minicourses.completed_at.id_#{minicourse.id}": null
      }

      if user?
        window.prefs = projectPreferences
        if projectPreferences?.preferences.minicourses?
          projectPreferences.update resetPreferences
          projectPreferences.save().then =>
            @start minicourse, projectPreferences, user
        else
          # Create default preferences if they don't exist
          @createProjectPreferences(projectPreferences, minicourse.id, project.id).then (newProjectPreferences) =>
            @start minicourse, newProjectPreferences, user

    startIfNecessary: ({workflow, preferences, project, user}) ->
      if user?
        @find({workflow}).then (minicourse) =>
          if minicourse?
            @checkIfCompletedOrOptedOut(minicourse, preferences, project, user).then (completed) =>
              unless completed
                @start minicourse, preferences, user

    checkIfCompletedOrOptedOut: (minicourse, projectPreferences, project, user) ->
      if user? and projectPreferences.preferences?.minicourses?
        window.prefs = projectPreferences
        if projectPreferences.preferences.minicourses.completed_at?["id_#{minicourse.id}"]?
          Promise.resolve projectPreferences.preferences.minicourses.completed_at?["id_#{minicourse.id}"]?
        else
          Promise.resolve projectPreferences.preferences.minicourses.opt_out["id_#{minicourse.id}"]
      else if user?
        newProjectPreferences = @createProjectPreferences(projectPreferences, minicourse.id, project.id)
        Promise.resolve newProjectPreferences.preferences.minicourses.opt_out["id_#{minicourse.id}"]

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
      projectPreferences

  getDefaultProps: ->
    media: {}
    minicourse: {}
    projectPreferences: {}
    user: {}

  getInitialState: ->
    optOut: false

  componentDidMount: ->
    # If user navigates away, record the next slide to load in prefs
    window.addEventListener 'beforeunload', @handleProjectPreferencesOnUnmount

  componentWillUnmount: ->
    window.removeEventListener 'beforeunload', @handleProjectPreferencesOnUnmount

    if @props.user?
      @handleProjectPreferencesOnUnmount()

  render: ->
    step = @props.minicourse.steps[@props.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"]]
    <div className="mini-course-dialog__steps">
      <MediaCard className="steps__step" src={@props.media[step.media]?.src}>
        <Markdown>{step.content}</Markdown>
        <hr />
        <div className="steps__step-actions">
          {if @props.user?
            <label className="action__opt-out">
              <input type="checkbox" onChange={@handleOptOut} checked={@state.optOut} />
              Do not show mini-course in the future
            </label>}
          <button type="submit" className="standard-button action__button">
            {if @state.optOut
              <span>Opt out <i className="fa fa-long-arrow-right fa-lg" aria-hidden="true"></i></span>
            else
              <span>Close</span>}
          </button>
        </div>
      </MediaCard>
    </div>

  handleOptOut: (e) ->
    checked = e.target.checked

    @props.projectPreferences.update "preferences.minicourses.opt_out.id_#{@props.minicourse.id}": checked
    @props.projectPreferences.save()
      .then =>
        @setState optOut: checked

  handleProjectPreferencesOnUnmount: ->
    if @props.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"] is @props.minicourse.steps.length - 1
      now = new Date().toISOString()
      minicoursesCompletedThisSession[@props.minicourse.id] = now

      @props.projectPreferences.update "preferences.minicourses.completed_at.id_#{@props.minicourse.id}": now
      @props.projectPreferences.save()
    else
      nextSlide = @props.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"] + 1

      @props.projectPreferences.update "preferences.minicourses.slide_to_start.id_#{@props.minicourse.id}": nextSlide
      @props.projectPreferences.save()
