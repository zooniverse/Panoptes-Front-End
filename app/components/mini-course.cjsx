React = require 'react'
Dialog = require 'modal-form/dialog'
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
    find: (workflow) ->
      # Prefer fetching the tutorial for the workflow, so we know which one to fetch if multiple exist.
      if workflow?
        apiClient.type('tutorials').get workflow_id: workflow.id, kind: "mini-course", include: ['attached_images']
          .then ([minicourse]) ->
            minicourse
      else
        Promise.resolve()

    start: (minicourse, projectPreferences, user, geordi) ->
      MiniCourseComponent = this
      if minicourse.steps.length isnt 0
        if minicourse.links.attached_images.ids? and minicourse.links.attached_images.ids.length isnt 0
          awaitMiniCourseMedia = apiClient.type('media').get(minicourse.links.attached_images.ids)
              .catch ->
                # Checking for attached images throws if there are none.
                []
              .then (mediaResources) ->
                mediaByID = {}
                for mediaResource in mediaResources
                  mediaByID[mediaResource.id] = mediaResource
                mediaByID
        else
          awaitMiniCourseMedia = Promise.resolve()

        awaitMiniCourseMedia.then (mediaByID) =>
          Dialog.alert(<MiniCourseComponent projectPreferences={projectPreferences} user={user} minicourse={minicourse} media={mediaByID} geordi={geordi} />, {
            className: 'mini-course-dialog',
            required: true,
            closeButton: true,
            top: 0.2
          })
            .catch =>
              null # We don't really care if the user canceled or completed the tutorial.

    restart: (minicourse, projectPreferences, user, geordi) ->
      resetPreferences = {
        "preferences.minicourses.opt_out.id_#{minicourse.id}": false,
        "preferences.minicourses.slide_to_start.id_#{minicourse.id}": 0
        "preferences.minicourses.completed_at.id_#{minicourse.id}": null
      }

      if user?
        projectPreferences.update resetPreferences
        projectPreferences.save().then =>
          window.prefs = projectPreferences
          @start minicourse, projectPreferences, user, geordi

    startIfNecessary: (minicourse, preferences, user, geordi) ->
      if user? && minicourse?
        @checkIfCompletedOrOptedOut(minicourse, preferences, user).then (completed) =>
          unless completed
            @start minicourse, preferences, user, geordi

    checkIfCompletedOrOptedOut: (minicourse, projectPreferences, user) ->
      if user? and projectPreferences.preferences?.minicourses?
        window.prefs = projectPreferences
        if projectPreferences.preferences.minicourses.completed_at?["id_#{minicourse.id}"]?
          Promise.resolve projectPreferences.preferences.minicourses.completed_at?["id_#{minicourse.id}"]?
        else
          Promise.resolve projectPreferences.preferences.minicourses.opt_out["id_#{minicourse.id}"]
      else if user?
        newProjectPreferences = @setDefaultProjectPreferences(projectPreferences, minicourse.id)
        Promise.resolve newProjectPreferences.preferences.minicourses.opt_out["id_#{minicourse.id}"]

    setDefaultProjectPreferences: (projectPreferences, minicourseID) ->
      defaultPreferences = {
        "preferences.minicourses.opt_out.id_#{minicourseID}": false,
        "preferences.minicourses.slide_to_start.id_#{minicourseID}": 0
      }

      projectPreferences.update defaultPreferences
      projectPreferences.save()
      projectPreferences

  getDefaultProps: ->
    geordi: {}
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

      @logToGeordi now
    else
      nextSlide = @props.projectPreferences.preferences.minicourses.slide_to_start["id_#{@props.minicourse.id}"] + 1

      @props.projectPreferences.update "preferences.minicourses.slide_to_start.id_#{@props.minicourse.id}": nextSlide
      @props.projectPreferences.save()

  logToGeordi: (datetime) ->
    @props.geordi.logEvent {
      type: 'mini-course-completion'
      data: {
        minicourse: @props.minicourse.id
        minicourseCompletedAt: datetime
      }
    }
