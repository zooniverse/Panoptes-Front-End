React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'SurveyAnnotationView'

  getDefaultProps: ->
    task: null
    annotations: null
    annotation: null

  render: ->
    <div>
      {for identification, i in @props.annotation.value
        identification._key ?= Math.random()

        answersByQuestion = @props.task.questionsOrder.map (questionID) =>
          if questionID of identification.answers
            answerLabels = [].concat(identification.answers[questionID]).map (answerID) =>
              @props.task.questions[questionID].answers[answerID].label
            answerLabels.join ', '
        answersList = answersByQuestion.filter(Boolean).join '; '

        <span key={identification._key}>
          <span className="survey-identification-proxy" title={answersList}>
            {@props.task.choices[identification.choice].label}
            {' '}
            <button type="button" className="survey-identification-remove" title="Remove" onClick={@handleRemove.bind this, i}>&times;</button>
          </span>
          {' '}
        </span>}
    </div>

  handleRemove: (index) ->
    @props.annotation.value.splice index, 1
    @props.onChange @props.annotation
