React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
Tutorial = require '../lib/tutorial'

module.exports = React.createClass
  getDefaultProps: ->
    user: null
    project: null

  getInitialState: ->
    tutorial: null

  componentDidMount: ->
    @fetchTutorialFor @props.project

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @fetchTutorialFor nextProps.project

  fetchTutorialFor: (project) ->
    apiClient.type('tutorials').get project_id: project.id
      .then ([tutorial]) =>
        @setState {tutorial}

  render: ->
    if @state.tutorial? and @state.tutorial.steps.length isnt 0
      <button type="button" {...@props} onClick={Tutorial.start.bind(Tutorial, @props.user, @props.project)}>
        {@props.children}
      </button>
    else
      null
