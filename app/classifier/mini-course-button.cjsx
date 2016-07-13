React = require 'react'
MiniCourse = require '../lib/mini-course'

module.exports = React.createClass
  displayName: 'MiniCourseButton'
  
  getDefaultProps: ->
    user: null
    project: null

  getInitialState: ->
    minicourse: null

  componentDidMount: ->
    @fetchMiniCourseFor @props.workflow

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      @fetchMiniCourseFor nextProps.workflow

  fetchMiniCourseFor: (workflow) ->
    @setState minicourse: null
    MiniCourse.find({workflow}).then (minicourse) =>
      @setState {minicourse}

  render: ->
    if @state.minicourse?.steps.length > 0 and @props.user?
      <button type="button" {...@props} onClick={MiniCourse.restart.bind(MiniCourse, @state.minicourse, @props.preferences, @props.project, @props.user)}>
        {@props.children}
      </button>
    else
      null