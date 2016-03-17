React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
MiniCourse = require '../lib/mini-course'

module.exports = React.createClass
  getDefaultProps: ->
    user: null
    project: null

  getInitialState: ->
    minicourse: null

  componentDidMount: ->
    @fetchMiniCourseFor @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @fetchMiniCourseFor nextProps.project

  fetchMiniCourseFor: (project) ->
    apiClient.type('minicourses').get project_id: project.id
      .then ([minicourse]) =>
        @setState {minicourse}

  render: ->
    if @state.minicourse? and @state.minicourse.steps.length isnt 0
      <button type="button" {...@props} onClick={MiniCourse.start.bind(MiniCourse, @props.user, @props.project)}>
        {@props.children}
      </button>
    else
      null