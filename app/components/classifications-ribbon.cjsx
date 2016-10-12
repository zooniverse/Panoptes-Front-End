React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'

ClassificationsRibbon = React.createClass
  displayName: 'ClassificationsRibbon'

  getDefaultProps: ->
    projects: for i in [0...20]
      {project: "Project #{i}", classifications: Math.floor Math.random() * 100}
    cutoff: 1 / 50
    width: '100%'
    height: '1em'

  getProjectColor: (name) ->
    characters = name.split ''
    hue = [0, characters...].reduce (code, character) ->
      # Square the number so that e.g. "a" and "b" aren't so close.
      return code + Math.pow character.charCodeAt(0), 2
    saturation = 50 + (hue % 50)
    hue %= 360
    "hsl(#{hue}, #{saturation}%, 50%)"

  render: ->
    if @props.projects.length is 0
      <span className="classifications-ribbon-empty" style={
        display: 'block'
        width: @props.width
        height: @props.height
      }>
        <span className="empty">No classifications yet</span>
      </span>

    else
      totalClassifications = 0
      for {classifications} in @props.projects
        totalClassifications += classifications ? 1

      others = []

      lastX = 0
      <svg className="classifications-ribbon" width={@props.width} height={@props.height} viewBox="0 0 1 1" preserveAspectRatio="none" style={display: 'block'}>
        {for {project, classifications}, i in @props.projects
          width = (classifications ? 1) / totalClassifications
          if width < @props.cutoff
            others.push {project, classifications}
            continue
          else
            band = <rect key={project} fill={@getProjectColor project} stroke="none" x={lastX} y="0" width={width} height="1">
              <title>
                {project}: {classifications ? '?'}
              </title>
            </rect>
            lastX += width
            band}

        {unless others.length is 0
          othersWidth = 1 - lastX
          <rect fill="gray" fillOpacity="0.5" stroke="none" x={lastX} y="0" width={othersWidth} height="1">
            <title>
              {("#{project}: #{classifications ? '?'}" for {project, classifications} in others when classifications > 0).join '\n'}
            </title>
          </rect>}
      </svg>

module.exports = React.createClass
  displayName: 'ClassificationsRibbonWrapper'

  getDefaultProps: ->
    user: null

  getInitialState: ->
    loading: false
    projects: []

  componentDidMount: ->
    if @props.user is null and location.hash.indexOf '/dev/' isnt -1
      zooAPI.type('users').get('3').then (user) =>
        @getClassificationCounts user
    else
      @getClassificationCounts @props.user

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user is @props.user
      @getClassificationCounts @props.user

  getClassificationCounts: (user) ->
    @setState loading: true
    @getAllProjectPreferences(user).then (preferences) =>
      projects = for preference in preferences
        apiClient.type('projects').get(preference.links.project).catch =>
          null
      Promise.all(projects).then (projects) =>
        counts = for i in  [0...preferences.length] when projects[i]?
          project: projects[i].display_name
          classifications: preferences[i].activity_count
        @setState
          loading: false
          projects: counts

  getAllProjectPreferences: (user, _page = 1, _collection = []) ->
    user.get('project_preferences', page: _page, include: 'project').then (projectPreferences) =>
      if projectPreferences.length is 0
        projectPreferences
      else
        _collection.push projectPreferences...
        meta = projectPreferences[0].getMeta()
        if meta.page is meta.page_count
          _collection
        else
          @getAllProjectPreferences user, meta.page + 1, _collection

  render: ->
    if @state.loading
      <span>Loading ribbon...</span>
    else
      <ClassificationsRibbon {...@props} projects={@state.projects} />
