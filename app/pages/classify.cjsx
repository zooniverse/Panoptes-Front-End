# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
Classifier = require '../classifier/page'
LoadingIndicator = require '../components/loading-indicator'
{dispatch} = require '../lib/dispatcher'

module.exports = React.createClass
  displayName: 'ClassifyPage'

  componentWillMount: ->
    @componentWillReceiveProps @props

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @state?.subject?.project
      subjectsStore.fetch(project: nextProps.project).then ([subject]) =>
        setTimeout @setState.bind this, {subject}

  render: ->
    console.log "Rendering #{@constructor.displayName}", @state?.subject?

    if @state?.subject?
      <Classifier subject={@state.subject.id} />

    else
      <div>
        <p>Waiting for subject from <code>{@props.project}</code> <LoadingIndicator /></p>
      </div>
