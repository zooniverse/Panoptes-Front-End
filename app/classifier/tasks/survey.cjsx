React = require 'react'
DropdownForm = require '../../components/dropdown-form'

Summary = React.createClass
  displayName: 'SurveySummary'

  render: ->
    <div>TODO: Survey summary</div>

Chooser = React.createClass
  displayName: 'Chooser'

  getDefaultProps: ->
    task: null
    filters: {}
    onFilter: Function.prototype
    onChoose: Function.prototype

  getFilteredChoices: ->
    for choiceID in @props.task.choicesOrder
      choice = @props.task.choices[choiceID]
      rejected = false
      for characteristicID, valueID of @props.filters
        if valueID not in choice.characteristics[characteristicID]
          rejected = true
          break
      if rejected
        continue
      else
        choiceID

  render: ->
    <div className="survey-chooser">
      {for characteristicID in @props.task.characteristicsOrder
        characteristic = @props.task.characteristics[characteristicID]

        label = <span>
          {characteristic.label}
          {if characteristicID of @props.filters
            '*'}
        </span>

        hasBeenAutoFocused = false

        <div key={characteristicID}>
          <DropdownForm ref="#{characteristicID}-dropdown" label={label}>
            {for valueID in characteristic.valuesOrder
              value = characteristic.values[valueID]

              disabled = valueID is @props.filters[characteristicID]
              autoFocus = not disabled and not hasBeenAutoFocused

              if autoFocus
                hasBeenAutoFocused = true

              <button type="submit" disabled={disabled} autoFocus={autoFocus} onClick={@handleFilter.bind this, characteristicID, valueID}>
                {value.label}
              </button>}

            <button type="submit" disabled={characteristicID not of @props.filters} autoFocus={not hasBeenAutoFocused} onClick={@handleFilter.bind this, characteristicID, undefined}>
              <i className="fa fa-ban"> Any</i>
            </button>
          </DropdownForm>
        </div>}

      {for choiceID in @getFilteredChoices()
        choice = @props.task.choices[choiceID]
        <div key={choiceID}>
          <button type="button" onClick={@props.onChoose.bind this, choiceID}>{choice.label}</button>
        </div>}
    </div>

  handleFilter: (characteristicID, valueID) ->
    @props.onFilter characteristicID, valueID

ImageFlipper = React.createClass
  displayName: 'ImageFlipper'

  getDefaultProps: ->
    images: []

  getInitialState: ->
    frame: 0

  PRELOAD_STYLE:
    height: 0
    overflow: 'hidden'
    position: 'fixed'
    right: 0
    width: 0

  render: ->
    <div className="image-flipper">
      {@renderPreload()}
      <img src={@props.images[@state.frame]} />
      {for index in [0...@props.images.length]
        <button type="button" disabled={index is @state.frame} onClick={@handleFrameChange.bind this, index}>{index + 1}</button>}
    </div>

  renderPreload: ->
    <div style={@PRELOAD_STYLE}>
      {for image in @props.images
        <img src={image} />}
    </div>

  handleFrameChange: (frame) ->
    @setState {frame}

Choice = React.createClass
  displayName: 'Choice'

  getDefaultProps: ->
    task: null
    choiceID: ''
    onConfirm: Function.prototype
    onCancel: Function.prototype

  getInitialState: ->
    answers: {}

  allFilledIn: ->
    requiredIDs = for questionID in @props.task.questionsOrder
      question = @props.task.questions[questionID]
      if question.multiple
        # Multiple-allowed questions aren't required.
        continue
      else
        questionID
    (true for id in requiredIDs when id not of @state.answers).length is 0

  render: ->
    choice = @props.task.choices[@props.choiceID]
    <div className="survey-choice">
      {unless choice.images.length is 0
        <ImageFlipper images={choice.images} />}
      <div className="survey-choice-label">{choice.label}</div>
      <div className="survey-choice-description">{choice.description}</div>
      {for questionID in @props.task.questionsOrder
        question = @props.task.questions[questionID]
        inputType = if question.multiple
          'checkbox'
        else
          'radio'
        <div key={questionID} className="survey-choice-question">
          {question.label}
          {for answerID in question.answersOrder
            answer = question.answers[answerID]
            isChecked = if question.multiple
              answerID in (@state.answers[questionID] ? [])
            else
              answerID is @state.answers[questionID]
            <span key={answerID}>
              <label className="survey-choice-answer" data-multiple={question.multiple}>
                <input type={inputType} checked={isChecked} onChange={@handleAnswer.bind this, questionID, answerID} />{' '}
                {answer.label}
              </label>
            </span>}
        </div>}
      <button type="button" onClick={@props.onCancel}>Cancel</button>
      <button type="button" disabled={not @allFilledIn()} onClick={@handleIdentification}>Identify</button>
    </div>

  handleAnswer: (questionID, answerID, e) ->
    if @props.task.questions[questionID].multiple
      @state.answers[questionID] ?= []
      if e.target.checked
        @state.answers[questionID].push answerID
      else
        @state.answers[questionID].splice @state.answers[questionID].indexOf(answerID), 1
    else
      @state.answers[questionID] = if e.target.checked
        answerID
      else
        null
    @setState answers: @state.answers

  handleIdentification: ->
    @props.onConfirm @props.choiceID, @state.answers

module.exports = React.createClass
  displayName: 'SurveyTask'

  statics:
    Editor: null
    Summary: Summary

    getDefaultTask: ->
      type: 'survey'
      characteristics: []
      choices: []

    getTaskText: (task) ->
      '(Survey)'

    getDefaultAnnotation: ->
      value: []

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
        <Choice task={@props.task} choiceID={@state.selectedChoiceID} onCancel={@clearSelection} onConfirm={@handleAnnotation} />}
    </div>

  handleFilter: (characteristicID, valueID) ->
    if valueID?
      @state.filters[characteristicID] = valueID
    else
      delete @state.filters[characteristicID]
    @setState filters: @state.filters

  handleChoice: (choiceID) ->
    @setState selectedChoiceID: choiceID

  clearFilters: ->
    @setState filters: {}

  clearSelection: ->
    @setState selectedChoiceID: ''

  handleAnnotation: (choice, details, e) ->
    filters = JSON.parse JSON.stringify @state.filters

    @props.annotation.value ?= []
    @props.annotation.value.push {choice, details, filters}
    @props.onChange e

    @clearFilters()
    @clearSelection()
