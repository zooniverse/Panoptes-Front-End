React = require 'react'
cloneWithProps = require 'react/lib/cloneWithProps'
alert = require '../../lib/alert'
Markdown = require '../../components/markdown'
Tooltip = require '../../components/tooltip'

module.exports = React.createClass
  displayName: 'GenericTask'

  getDefaultProps: ->
    question: ''
    help: ''
    answers: ''

  getInitialState: ->
    helping: false

  render: ->
    <div className="workflow-task">
      <Markdown className="question">{@props.question}</Markdown>
      <div className="answers">
        {React.Children.map @props.answers, (answer) ->
          cloneWithProps answer,  className: 'answer'}
      </div>
      {if @props.help
        <p className="help">
          <br />
          <small>
            <strong>
              <button type="button" className="minor-button" onClick={@showHelp}>
                Need some help?
              </button>
            </strong>
          </small>
        </p>}
    </div>

  showHelp: ->
    alert <Markdown className="classification-task-help">{@props.help}</Markdown>
