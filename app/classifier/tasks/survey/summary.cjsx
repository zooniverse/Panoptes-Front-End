React = require 'react'
Utility = require './utility'

module.exports = React.createClass
  displayName: 'SurveySummary'

  getDefaultProps: ->
    task: null
    annotation: null
    expanded: false

  getInitialState: ->
    expanded: @props.expanded

  render: ->
    <div>
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
            allAnswers = for questionID in Utility.getQuestionIDs(@props.task, identification.choice) when questionID of identification.answers
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
