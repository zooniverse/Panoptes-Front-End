# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
classificationsStore = require '../data/classifications'
Classifier = require '../classifier/classifier'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'ClassifyPage'

  getInitialState: ->
    classification: null

  componentWillMount: ->
    @loadClassificationFor @props.project

  componentWillReceiveProps: (nextProps) ->
    unless classificationsStore.inProgress[nextProps.project] is @state.classification
      @loadClassificationFor nextProps.project

  loadClassificationFor: (project) ->
    classification = classificationsStore.inProgress[project]
    classification ?= subjectsStore.fetch({project}).then ([subject]) ->
      classificationsStore.inProgress[project] ?= classificationsStore.create
        subject: subject.id
        workflow: subject.workflow
      classificationsStore.inProgress[project]

    Promise.all([classification]).then ([classification]) =>
      @setState {classification}

  render: ->
    if @state.classification?
      <Classifier classification={@state.classification.id} />
    else
      <p>Loading classification for project <code>{@props.project}</code></p>
