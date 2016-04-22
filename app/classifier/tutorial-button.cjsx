React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Tutorial = require '../lib/tutorial'

module.exports = React.createClass
  getDefaultProps: ->
    workflow: null
    project: null
    user: null

  getInitialState: ->
    tutorial: null

  componentDidMount: ->
    @fetchTutorialFor @props.workflow, @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      @fetchTutorialFor nextProps.workflow, nextProps.project

  fetchTutorialFor: (workflow, project) ->
    @setState tutorial: null
    Tutorial.find({workflow, project}).then (tutorial) =>
      @setState {tutorial}

  render: ->
    if @state.tutorial?.steps.length > 0
      <button type="button" {...@props} onClick={Tutorial.start.bind(Tutorial, @state.tutorial, @props.user)}>
        {@props.children}
      </button>
    else
      null
