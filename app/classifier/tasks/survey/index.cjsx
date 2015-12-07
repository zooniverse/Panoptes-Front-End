React = require 'react'
Editor = require './editor'
Summary = require './summary'
Chooser = require './chooser'
Choice = require './choice'
AnnotationView = require './annotation-view'

module.exports = React.createClass
  displayName: 'SurveyTask'

  statics:
    Editor: Editor
    Summary: Summary
    AfterSubject: AnnotationView

    getDefaultTask: ->
      type: 'survey'
      characteristicsOrder: []
      characteristics: {}
      choicesOrder: []
      choices: {}
      questionsOrder: []
      questions: {}
      images: {}

    getTaskText: (task) ->
      "Survey of #{task.choicesOrder.length} choices"

    getDefaultAnnotation: ->
      value: []

    isAnnotationComplete: (task, annotation) ->
      # Booleans compare to numbers as expected: true = 1, false = 0.
      annotation.value.length >= (task.required ? 0) and not annotation._choiceInProgress

    testAnnotationQuality: (unknown, knownGood) ->
      # NOTE: Currently only choices (not answers) are compared.
      unknownChoices = unknown.value.map ({choice}) ->
        choice
      knownGoodChoices = knownGood.value.map ({choice}) ->
        choice
      total = 0
      matches = 0
      unknownChoices.forEach (choice) ->
        total += 1
        if choice in knownGoodChoices
          matches += 1
      knownGoodChoices.forEach (choice) ->
        total += 1
        if choice in unknownChoices
          matches += 1
      if total is 0
        1
      else
        matches / total

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: Function.prototype

  getInitialState: ->
    filters: {}
    selectedChoiceID: ''

  render: ->
    <div className="survey-task">
      {if @state.selectedChoiceID is ''
        <Chooser task={@props.task} filters={@state.filters} onFilter={@handleFilter} onChoose={@handleChoice} />
      else
        <Choice task={@props.task} choiceID={@state.selectedChoiceID} onSwitch={@handleChoice} onCancel={@clearSelection} onConfirm={@handleAnnotation} />}
    </div>

  handleFilter: (characteristicID, valueID) ->
    setTimeout =>
      if valueID?
        @state.filters[characteristicID] = valueID
      else
        delete @state.filters[characteristicID]
      @setState filters: @state.filters

  handleChoice: (choiceID) ->
    @props.annotation._choiceInProgress = true
    @setState selectedChoiceID: choiceID
    @props.onChange()

  clearFilters: ->
    @setState filters: {}

  clearSelection: ->
    @props.annotation._choiceInProgress = false
    @setState selectedChoiceID: ''
    @props.onChange()

  handleAnnotation: (choice, answers, e) ->
    filters = JSON.parse JSON.stringify @state.filters

    @props.annotation.value ?= []
    @props.annotation.value.push {choice, answers, filters}
    @props.onChange e

    @clearFilters()
    @clearSelection()
