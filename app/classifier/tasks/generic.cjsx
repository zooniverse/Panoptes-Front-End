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
      <Markdown className="question">{@props.question}</Markdown>
      <div className="answers">
        {React.Children.map @props.answers, (answer) ->
          cloneWithProps answer,  className: 'workflow-task-answer'}
      </div>
      {if @props.help
        <p className="help">
          <button type="button" className="pill" onClick={@showHelp}>Need some help?</button>
        </p>}
    </div>

  showHelp: ->
    alert <div className="content-container">
      <Markdown className="classification-task-help">{@props.help}</Markdown>
    </div>
