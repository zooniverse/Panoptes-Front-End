React = require 'react'
Tutorial = require '../lib/tutorial'

module.exports = React.createClass
  getDefaultProps: ->
    workflow: null
    project: null
    user: null
    tutorial: null

  componentDidMount: ->
    {tutorial, user, preferences} = @props
    Tutorial.startIfNecessary tutorial, user, preferences

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.workflow is @props.workflow and nextProps.project is @props.project
      {user, preferences, tutorial} = nextProps
      Tutorial.startIfNecessary tutorial, user, preferences

  render: ->
    if @props.tutorial?.steps.length > 0
      <button type="button" className={@props.className} style={@props.style} onClick={Tutorial.start.bind(Tutorial, @props.tutorial, @props.user)}>
        {@props.children}
      </button>
    else
      null
