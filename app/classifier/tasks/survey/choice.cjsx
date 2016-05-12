React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'
{Markdown} = require 'markdownz'
Utility = require './utility'

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

module.exports = React.createClass
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
    for questionID in Utility.getQuestionIDs(@props.task, @props.choiceID)
      question = @props.task.questions[questionID]
      if question.required
        answer = @state.answers[questionID]
        if (not answer?) or (question.multiple and answer.length is 0)
          return false
    true

  anyFilledIn: ->
    # if there are no questions, don't make them fill one in
    return true unless Utility.getQuestionIDs(@props.task, @props.choiceID).length

    # if there are questions, it's fine as long as they've filled ONE in
    for questionID in Utility.getQuestionIDs(@props.task, @props.choiceID)
      question = @props.task.questions[questionID]
      answer = @state.answers[questionID]
      if(answer?)
        return true

    # they must fill out at least one
    false

  render: ->
    choice = @props.task.choices[@props.choiceID]
    <div className="survey-task-choice">
      {unless choice.images.length is 0
        <ImageFlipper images={@props.task.images[filename] for filename in choice.images} />}
      <div className="survey-task-choice-content">
        <div className="survey-task-choice-label">{choice.label}</div>
        <div className="survey-task-choice-description">{choice.description}</div>

        {unless choice.confusionsOrder.length is 0
          <div className="survey-task-choice-confusions">
            Often confused with
            {' '}
            {for otherChoiceID in choice.confusionsOrder
              otherChoice = @props.task.choices[otherChoiceID]
              <span key={otherChoiceID}>
                <TriggeredModalForm className="survey-task-confusions-modal" trigger={
                  <span className="survey-task-choice-confusion">
                    {otherChoice.label}
                  </span>
                } style={maxWidth: '60ch'}>
                  <ImageFlipper images={@props.task.images[filename] for filename in otherChoice.images} />
                  <Markdown content={choice.confusions[otherChoiceID]} />
                  <div className="survey-task-choice-confusion-buttons" style={textAlign: 'center'}>
                    <button type="submit" className="major-button identfiy">Dismiss</button>
                    {' '}
                    <button type="button" className="standard-button cancel" onClick={@props.onSwitch.bind null, otherChoiceID}>I think it’s this</button>
                  </div>
                </TriggeredModalForm>
                {' '}
              </span>}
          </div>}

        <hr />

        {unless choice.noQuestions
          for questionID in Utility.getQuestionIDs(@props.task, @props.choiceID)
            question = @props.task.questions[questionID]
            inputType = if question.multiple
              'checkbox'
            else
              'radio'
            <div key={questionID} className="survey-task-choice-question" data-multiple={question.multiple || null}>
              <div className="survey-task-choice-question-label">{question.label}</div>
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

        {unless choice.noQuestions or Utility.getQuestionIDs(@props.task, @props.choiceID).length is 0
          <hr />}
      </div>
      <div style={textAlign: 'center'}>
        <button type="button" className="minor-button" onClick={@props.onCancel}>Cancel</button>
        {' '}
        <button type="button" className="standard-button" disabled={not @allFilledIn() or not @anyFilledIn()} onClick={@handleIdentification}>
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
