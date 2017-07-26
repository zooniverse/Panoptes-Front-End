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
      <div className="survey-task-image-flipper-pips">
        {unless @props.images.length is 1
          for index in [0...@props.images.length]
            <label key={@props.images[index]}  className="survey-task-image-flipper-pip #{if index is @state.frame then 'active' else ''}">
              <input type="radio" name="image-flipper" autoFocus={index is 0} checked={index is @state.frame} onChange={@handleFrameChange.bind this, index} />{index + 1}
            </label>}
      </div>
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

  propTypes:
    annotation: React.PropTypes.shape({
      answers: React.PropTypes.object,
      choice: React.PropTypes.string,
      filters: React.PropTypes.object
    })


  getDefaultProps: ->
    annotation: { answers: {} }
    task: null
    choiceID: ''
    onSwitch: Function.prototype
    onConfirm: Function.prototype
    onCancel: Function.prototype

  getInitialState: ->
    answers: @props.annotation.answers
    focusedAnswer: ''

  checkFilledIn: ->
    # if there are no questions, don't make them fill one in
    return true unless Utility.getQuestionIDs(@props.task, @props.choiceID).length

    # if there are questions, it's fine as long as they've filled required ones in
    answerProvided = []
    for questionID in Utility.getQuestionIDs(@props.task, @props.choiceID)
      question = @props.task.questions[questionID]
      if question.required
        answer = @state.answers[questionID]
        if (answer?.length isnt 0) and answer?
          answerProvided.push true
        else
          answerProvided.push false
      else
        answerProvided.push true
    canIdentify = answerProvided.every (answer) -> answer is true

  render: ->
    hasFocus = false
    choice = @props.task.choices[@props.choiceID]
    <div className="survey-task-choice">
      {unless choice.images.length is 0
        hasFocus = choice.images.length > 1
        <ImageFlipper images={@props.task.images[filename] for filename in choice.images} />}
      <div className="survey-task-choice-content">
        <div className="survey-task-choice-label">{choice.label}</div>
        <div className="survey-task-choice-description">{choice.description}</div>

        {unless choice.confusionsOrder.length is 0
          <div className="survey-task-choice-confusions">
            Often confused with
            {' '}
            {for otherChoiceID, i in choice.confusionsOrder
              otherChoice = @props.task.choices[otherChoiceID]
              <span key={otherChoiceID}>
                <TriggeredModalForm
                  className="survey-task-confusions-modal"
                  triggerProps={autoFocus: not hasFocus and i is 0}
                  trigger={
                    <span className="survey-task-choice-confusion">
                      {otherChoice.label}
                      </span>
                  }
                  style={maxWidth: '60ch'}
                >
                  <ImageFlipper images={@props.task.images[filename] for filename in otherChoice.images} />
                  <Markdown content={choice.confusions[otherChoiceID]} />
                  <div className="survey-task-choice-confusion-buttons" style={textAlign: 'center'}>
                    <button type="submit" autoFocus={true and otherChoice.images.length < 2} className="major-button identfiy">Dismiss</button>
                    {' '}
                    <button type="button" className="standard-button cancel" onClick={@props.onSwitch.bind null, otherChoiceID}>I think it’s this</button>
                  </div>
                </TriggeredModalForm>
                {' '}
                {hasFocus = true}
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
              {for answerID, i in question.answersOrder
                answer = question.answers[answerID]
                isChecked = if question.multiple
                  answerID in (@state.answers[questionID] ? [])
                else
                  answerID is @state.answers[questionID]
                isFocused = @state.focusedAnswer is "#{questionID}/#{answerID}"
                <span key={answerID}>
                  <label className="survey-task-choice-answer" data-checked={isChecked || null} data-focused={isFocused || null}>
                    <input
                      ref={questionID}
                      name={questionID}
                      type={inputType}
                      autoFocus={not hasFocus and i is 0}
                      checked={isChecked}
                      onChange={@handleAnswer.bind this, questionID, answerID}
                      onFocus={@handleFocus.bind this, questionID, answerID}
                      onBlur={@handleFocus.bind this, null, null}
                    />
                    {answer.label}
                  </label>
                  {' '}
                  {hasFocus=true}
                </span>}
            </div>}

        {unless choice.noQuestions or Utility.getQuestionIDs(@props.task, @props.choiceID).length is 0
          <hr />}
      </div>
      <div style={textAlign: 'center'}>
        <button type="button" autoFocus={not hasFocus} className="minor-button" onClick={@props.onCancel}>Cancel</button>
        {' '}
        <button type="button" className="standard-button" disabled={not @checkFilledIn()} onClick={@handleIdentification}>
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
      if answerID is @state.answers[questionID]
        delete @state.answers[questionID]
        @refs[questionID].checked = false
      else
        @state.answers[questionID] = answerID
    @setState answers: @state.answers

  handleFocus: (questionID, answerID, e) ->
    if questionID and answerID
      @setState focusedAnswer: "#{questionID}/#{answerID}"
    else
      @setState focusedAnswer: ''

  handleIdentification: ->
    @props.onConfirm @props.choiceID, @state.answers
