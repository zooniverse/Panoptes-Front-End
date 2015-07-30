React = require 'react'
DropdownForm = require '../../components/dropdown-form'
{Markdown} = require 'markdownz'

THUMBNAIL_BREAKPOINTS = [Infinity, 40, 20, 10, 5, 0]

Summary = React.createClass
  displayName: 'SurveySummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  getInitialState: ->
    expanded: @props.expanded

  render: ->
    <div className="classification-task-summary">
      <div className="question">
        Survey of {@props.task.choicesOrder.length}
        {if @state.expanded
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: false, null}>Less</button>
        else
          <button type="button" className="toggle-more" onClick={@setState.bind this, expanded: true, null}>More</button>}
      </div>
      <div className="answers">
        <div className="answer">
          {@props.annotation.value.length} identifications
        </div>
        {if @state.expanded
          choiceSummaries = for identification in @props.annotation.value
            choice = @props.task.choices[identification.choice]
            allAnswers = for questionID in @props.task.questionsOrder when questionID of identification.answers
              answerLabels = for answerID in [].concat identification.answers[questionID]
                @props.task.questions[questionID].answers[answerID].label
              answerLabels.join ', '

            "#{choice.label}: #{allAnswers.join '; '}"

          for choiceSummary, i in choiceSummaries
            <div key={i} className="answer">
              {choiceSummary}
            </div>}
      </div>
    </div>

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
    filteredChoices = @getFilteredChoices()

    for point in THUMBNAIL_BREAKPOINTS
      if filteredChoices.length <= point
        breakpoint = point

    <div className="survey-task-chooser">
      <div className="survey-task-chooser-characteristics">
        {for characteristicID in @props.task.characteristicsOrder
          characteristic = @props.task.characteristics[characteristicID]
          selectedValue = characteristic.values[@props.filters[characteristicID]]
          hasBeenAutoFocused = false

          <DropdownForm key={characteristicID} ref="#{characteristicID}-dropdown" className="survey-task-chooser-characteristic-menu" label={
            <span className="survey-task-chooser-characteristic" data-is-active={selectedValue? || null}>
              <span className="survey-task-chooser-characteristic-label">{selectedValue?.label ? characteristic.label}</span>
            </span>
          }>
            {for valueID in characteristic.valuesOrder
              value = characteristic.values[valueID]

              disabled = valueID is @props.filters[characteristicID]
              autoFocus = not disabled and not hasBeenAutoFocused

              if autoFocus
                hasBeenAutoFocused = true

              <span key={valueID}>
                <button type="submit" className="survey-task-chooser-characteristic-value" disabled={disabled} autoFocus={autoFocus} onClick={@handleFilter.bind this, characteristicID, valueID}>
                  {if value.image?
                    <img src={@props.task.images[value.image]} className="survey-task-chooser-characteristic-value-icon" />}
                  <div className="survey-task-chooser-characteristic-value-label">{value.label}</div>
                </button>
                {' '}
              </span>}

            &ensp;
            <button type="submit" className="survey-task-chooser-characteristic-clear-button" disabled={characteristicID not of @props.filters} autoFocus={not hasBeenAutoFocused} onClick={@handleFilter.bind this, characteristicID, undefined}>
              <i className="fa fa-ban"></i> Any
            </button>
          </DropdownForm>}
      </div>

      <div className="survey-task-chooser-choices" data-breakpoint={breakpoint}>
        {if filteredChoices.length is 0
          <div>
            <em>No matches.</em>
          </div>
        else
          for choiceID, i in filteredChoices
            choice = @props.task.choices[choiceID]
            <button key={choiceID + i} type="button" className="survey-task-chooser-choice" onClick={@props.onChoose.bind null, choiceID}>
              {unless choice.images.length is 0
                  <img src={choice.images[0]} className="survey-task-chooser-choice-thumbnail" />}
              <div className="survey-task-chooser-choice-label">{choice.label}</div>
            </button>}
      </div>
      <div style={textAlign: 'center'}>
        Showing {filteredChoices.length} of {@props.task.choicesOrder.length}.
        &ensp;
        <button type="button" className="survey-task-chooser-characteristic-clear-button" disabled={Object.keys(@props.filters).length is 0} onClick={@handleClearFilters}>
          <i className="fa fa-ban"></i> Clear filters
        </button>
      </div>
    </div>

  handleFilter: (characteristicID, valueID) ->
    @props.onFilter characteristicID, valueID

  handleClearFilters: ->
    for characteristicID in @props.task.characteristicsOrder
      @props.onFilter characteristicID, undefined

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
    <span className="survey-task-image-flipper">
      {@renderPreload()}
      <img src={@props.images[@state.frame]} className="survey-task-image-flipper-image" />
      <span className="survey-task-image-flipper-pips">
        {unless @props.images.length is 1
          for index in [0...@props.images.length]
            <span key={@props.images[index]}>
              <button type="button" className="survey-task-image-flipper-pip" disabled={index is @state.frame} onClick={@handleFrameChange.bind this, index}>{index + 1}</button>
              {' '}
            </span>}
      </span>
    </span>

  renderPreload: ->
    <div style={@PRELOAD_STYLE}>
      {for image in @props.images
        <img src={image} key={image} />}
    </div>

  handleFrameChange: (frame) ->
    @setState {frame}

Choice = React.createClass
  displayName: 'Choice'

  getDefaultProps: ->
    task: null
    choiceID: ''
    onSwitch: Function.prototype
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
    <div className="survey-task-choice">
      {unless choice.images.length is 0
        <ImageFlipper images={choice.images} />}

      <div className="survey-task-choice-label">{choice.label}</div>
      <div className="survey-task-choice-description">{choice.description}</div>

      {unless choice.confusionsOrder.length is 0
        <div className="survey-task-choice-confusions">
          Often confused with
          {' '}
          {for otherChoiceID in choice.confusionsOrder
            <span key={otherChoiceID}>
              <DropdownForm label={
                <span className="survey-task-choice-confusion">
                  {@props.task.choices[otherChoiceID].label}
                </span>
              }>
                <Markdown content={choice.confusions[otherChoiceID]} />
                <div style={textAlign: 'center'}>
                  <button type="button" className="standard-button" onClick={@props.onSwitch.bind null, otherChoiceID}>I think it’s this</button>
                  {' '}
                  <button type="submit" className="major-button">Dismiss</button>
                </div>
              </DropdownForm>
              {' '}
            </span>}
        </div>}

      <hr />

      {for questionID in @props.task.questionsOrder
        question = @props.task.questions[questionID]
        inputType = if question.multiple
          'checkbox'
        else
          'radio'
        <div key={questionID} className="survey-task-choice-question" data-multiple={question.multiple || null}>
          {question.label}
          {' '}
          {for answerID in question.answersOrder
            answer = question.answers[answerID]
            isChecked = if question.multiple
              answerID in (@state.answers[questionID] ? [])
            else
              answerID is @state.answers[questionID]
            <span key={answerID}>
              <label className="survey-task-choice-answer" data-checked={isChecked || null}>
                <input type={inputType} checked={isChecked} onChange={@handleAnswer.bind this, questionID, answerID} />
                {answer.label}
              </label>
              {' '}
            </span>}
        </div>}

      {unless @props.task.questionsOrder.lengths is 0
        <hr />}

      <div style={textAlign: 'center'}>
        <button type="button" className="minor-button" onClick={@props.onCancel}>Cancel</button>
        {' '}
        <button type="button" className="standard-button" disabled={not @allFilledIn()} onClick={@handleIdentification}>
          <strong>Identify</strong>
        </button>
      </div>
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
    Editor: require './survey-editor'
    Summary: Summary

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

  handleAnnotation: (choice, answers, e) ->
    filters = JSON.parse JSON.stringify @state.filters

    @props.annotation.value ?= []
    @props.annotation.value.push {choice, answers, filters}
    @props.onChange e

    @clearFilters()
    @clearSelection()
