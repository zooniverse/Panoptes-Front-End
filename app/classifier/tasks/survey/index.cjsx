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
        <Chooser task={@props.task} filters={@state.filters} onFilter={@handleFilter} onChoose={@handleChoice} annotation={@props.annotation} />
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
    @setState selectedChoiceID: choiceID
    newAnnotation = Object.assign {}, @props.annotation, _choiceInProgress: true
    @props.onChange newAnnotation

  clearFilters: ->
    @setState filters: {}

  clearSelection: ->
    @setState selectedChoiceID: ''
    newAnnotation = Object.assign {}, @props.annotation, _choiceInProgress: false
    @props.onChange newAnnotation

  handleAnnotation: (choice, answers, e) ->
    filters = JSON.parse JSON.stringify @state.filters
    value = @props.annotation.value?.slice?(0) ? []
    value.push {choice, answers, filters}
    @clearFilters()
    @clearSelection()
    setTimeout => # Wait for filters and selection to clear.
      newAnnotation = Object.assign {}, @props.annotation, {value}
      @props.onChange newAnnotation
