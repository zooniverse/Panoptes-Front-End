React = require 'react'
Tutorial = require '../lib/tutorial'

module.exports = React.createClass
  getDefaultProps: ->
    workflow: null
    project: null
    user: null

  getInitialState: ->
    tutorial: null

  componentDidMount: ->
    @fetchTutorialFor @props.workflow

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      @fetchTutorialFor nextProps.workflow

  fetchTutorialFor: (workflow) ->
    @setState tutorial: null
    Tutorial.find({workflow}).then (tutorial) =>
      @setState {tutorial}

  render: ->
    if @state.tutorial?.steps.length > 0
      <button type="button" {...@props} onClick={Tutorial.start.bind(Tutorial, @state.tutorial, @props.user)}>
        {@props.children}
      </button>
    else
      null
