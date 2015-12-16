React = require 'react'
apiClient = require '../api/client'
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
      <button type="button" className="secret-button" title="Project tutorial" aria-label="Show the project tutorial" onClick={Tutorial.start.bind(Tutorial, @props.user, @props.project)}>
        <i className="fa fa-graduation-cap fa-fw" />
      </button>
    else
      null
