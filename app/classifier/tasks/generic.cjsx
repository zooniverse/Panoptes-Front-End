React = require 'react'
cloneWithProps = require 'react/lib/cloneWithProps'
alert = require '../../lib/alert'
{Markdown} = require 'markdownz'
Tooltip = require '../../components/tooltip'

module.exports = React.createClass
  displayName: 'GenericTask'

  getDefaultProps: ->
    question: ''
    help: ''
    answers: []

  getInitialState: ->
    helping: false

  render: ->
    <div className="workflow-task">
      <Markdown className="question">{@props.question}</Markdown>
      {@props.children}
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
    alert <div className="content-container">
      <Markdown className="classification-task-help">{@props.help}</Markdown>
    </div>
