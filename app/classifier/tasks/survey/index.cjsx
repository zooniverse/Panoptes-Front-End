React = require 'react'
Editor = require './editor'
Summary = require './summary'
Chooser = require('./chooser').default
Choice = require('./choice').default
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
    focusedChoice: ''

  render: ->
    <div className="survey-task">
      {if @state.selectedChoiceID is ''
        <Chooser task={@props.task} filters={@state.filters} onFilter={@handleFilter} onChoose={@handleChoice} onRemove={@handleRemove} annotation={@props.annotation} focusedChoice={@state.focusedChoice} />
      else
        # @ is undefined within the scope of find
        currentSelection = @state.selectedChoiceID
        existingAnnotationValue = @props.annotation.value.find (value) -> value.choice is currentSelection
        <Choice annotationValue={existingAnnotationValue} task={@props.task} choiceID={@state.selectedChoiceID} onSwitch={@handleChoice} onCancel={@clearSelection} onConfirm={@handleAnnotation} />}
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

  handleRemove: (choiceID) ->
    selectedChoices = (item.choice for item in @props.annotation.value)
    index = selectedChoices.indexOf choiceID
    @props.annotation.value.splice index, 1
    newAnnotation = Object.assign {}, @props.annotation
    @props.onChange newAnnotation

  clearFilters: ->
    @setState filters: {}

  clearSelection: ->
    @setState
      selectedChoiceID: ''
      focusedChoice: @state.selectedChoiceID
    newAnnotation = Object.assign {}, @props.annotation, _choiceInProgress: false
    @props.onChange newAnnotation

  handleAnnotation: (choice, answers, e) ->
    filters = JSON.parse JSON.stringify @state.filters
    value = @props.annotation.value?.filter (value) -> value.choice isnt choice
    value.push {choice, answers, filters}
    @clearFilters()
    @clearSelection()
    setTimeout => # Wait for filters and selection to clear.
      newAnnotation = Object.assign {}, @props.annotation, {value}
      @props.onChange newAnnotation
