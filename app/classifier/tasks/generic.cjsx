React = require 'react'
cloneWithProps = require 'react/lib/cloneWithProps'
alert = require '../../lib/alert'
Markdown = require '../../components/markdown'

module.exports = React.createClass
  displayName: 'GenericTask'

  getDefaultProps: ->
    question: ''
    help: ''
    answers: ''

  render: ->
    <div className="workflow-task">
      <div className="question">
        {@props.question}
        {if @props.help
          <button type="button" onClick={@showHelp}>
            <i className="fa fa-question-circle"></i>
          </button>}
      </div>
      <div className="answers">
        {React.Children.map @props.answers, (answer) ->
          cloneWithProps answer,  className: 'workflow-task-answer'}
      </div>
    </div>

  showHelp: ->
    alert <Markdown>{@props.help}</Markdown>
