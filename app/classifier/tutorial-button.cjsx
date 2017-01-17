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
    .then (tutorial) =>
      {user, preferences} = @props
      Tutorial.startIfNecessary tutorial, user, preferences

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      @fetchTutorialFor nextProps.workflow
      .then (tutorial) =>
        {user, preferences} = nextProps
        Tutorial.startIfNecessary tutorial, user, preferences
        
        

  fetchTutorialFor: (workflow) ->
    @setState tutorial: null
    Tutorial.find({workflow}).then (tutorial) =>
      @setState {tutorial}

  render: ->
    if @state.tutorial?.steps.length > 0
      <button type="button" className={@props.className} style={@props.style} onClick={Tutorial.start.bind(Tutorial, @state.tutorial, @props.user)}>
        {@props.children}
      </button>
    else
      null
