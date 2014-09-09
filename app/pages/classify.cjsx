# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
classificationsStore = require '../data/classifications'
Classifier = require '../classifier/classifier'
LoadingIndicator = require '../components/loading-indicator'

# Map a project ID to a classification ID
classificationsInProgress = window.classificationsInProgress = {}

# TODO: Think about making `classificationsInProgress` a store,
# then having this component just listen for changes.

module.exports = React.createClass
  displayName: 'ClassifyPage'

  getInitialState: ->
    classification: null

  componentWillMount: ->
    @loadClassificationFor @props.project

  componentWillReceiveProps: (nextProps) ->
    unless classificationsInProgress[nextProps.project] is @state.classification
      @loadClassificationFor nextProps.project

  loadClassificationFor: (project) ->
    classification = classificationsInProgress[project]
    classification ?= subjectsStore.fetch({project}).then ([subject]) ->
      classificationsInProgress[project] ?= classificationsStore.create
        subject: subject.id
        workflow: subject.workflow
      classificationsInProgress[project]

    Promise.all([classification]).then ([classification]) =>
      @setState {classification}

  render: ->
    <div>
      {if @state.classification?
        <Classifier classification={@state.classification.id} />

      else
        <p>Loading classification for project <code>{@props.project}</code></p>}
    </div>
