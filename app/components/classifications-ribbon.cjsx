React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
`import getColorFromString from '../lib/get-color-from-string';`
`import getUserClassificationCounts from '../lib/get-user-classification-counts';`

ClassificationsRibbon = React.createClass
  displayName: 'ClassificationsRibbon'

  getDefaultProps: ->
    projects: for i in [0...20]
      {project: "Project #{i}", classifications: Math.floor Math.random() * 100}
    cutoff: 1 / 50
    width: '100%'
    height: '1em'

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
            band = <rect key={project} fill={getColorFromString project} stroke="none" x={lastX} y="0" width={width} height="1">
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
      @getClassificationCounts nextProps.user

  getClassificationCounts: (user) ->
    @setState loading: true

    getUserClassificationCounts(@props.user).then (projects) =>
      pairs = []
      for i in [0...projects.length]
        pairs.push
          project: projects[i].display_name
          classifications: projects[i].activity_count
      @setState
        loading: false
        projects: pairs

  render: ->
    if @state.loading
      <span>Loading ribbon...</span>
    else
      <ClassificationsRibbon {...@props} projects={@state.projects} />
