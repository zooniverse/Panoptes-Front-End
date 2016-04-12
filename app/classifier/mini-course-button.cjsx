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
    @fetchMiniCourseFor @props.workflow, @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      @fetchMiniCourseFor nextProps.workflow, nextProps.project

  fetchMiniCourseFor: (workflow, project) ->
    @setState minicourse: null
    MiniCourse.find({workflow, project}).then (minicourse) =>
      @setState {minicourse}

  render: ->
    if @state.minicourse?.steps.length > 0
      <button type="button" {...@props} onClick={MiniCourse.start.bind(MiniCourse, @state.minicourse, @props.user)}>
        {@props.children}
      </button>
    else
      null