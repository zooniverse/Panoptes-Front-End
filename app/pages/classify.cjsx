React = require 'react'
classificationsStore = require '../data/classifications'
{dispatch} = require '../lib/dispatcher'
Classifier = require '../classifier/classifier'
LoadingIndicator = require '../components/loading-indicator'

# This module just takes a project ID
# and recalls or creates a local in-progress classification for it.
# The Classifier does all the hard work from there.

module.exports = React.createClass
  displayName: 'ClassifyPage'

  getInitialState: ->
    classification: null

  componentDidMount: ->
    classificationsStore.listen @handleClassificationsChange
    @loadClassificationFor @props.project

  componentWillUnmount: ->
    classificationsStore.stopListening @handleClassificationsChange

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.project is @props.project
      @loadClassificationFor nextProps.project

  handleClassificationsChange: ->
    @loadClassificationFor @props.project

  loadClassificationFor: (project) ->
    classification = classificationsStore.inProgress[project]
    if classification?
      if classification instanceof Promise
        @setState classification: null
      else
        @setState {classification}
    else
      dispatch 'classification:create', project

  render: ->
    if @state.classification?
      <Classifier classification={@state.classification} />
    else
      <p>Loading classification for project <code>{@props.project}</code></p>
