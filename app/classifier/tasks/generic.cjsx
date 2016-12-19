React = require 'react'
alert = require '../../lib/alert'
{Markdown} = require 'markdownz'

module.exports = React.createClass
  displayName: 'GenericTask'

  getDefaultProps: ->
    question: ''
    help: ''
    required: false
    answers: []

  getInitialState: ->
    helping: false

  render: ->
    <div className="workflow-task">
      <Markdown className="question">{@props.question}</Markdown>
      {@props.children}
      <div className="answers">
        {React.Children.map @props.answers, (answer) ->
          React.cloneElement answer, {className: "answer #{answer.props.className}"}}
      </div>

      {if @props.required
        <div className="required-task-warning">
          <p>
            <small>
              <strong>This step is required.</strong>
              <br />
              If you’re not allowed to continue, make sure it’s complete.
            </small>
          </p>
        </div>}

      {if @props.help
        <div>
          <hr />
          <p>
            <small>
              <strong>
                <button type="button" className="minor-button" onClick={@showHelp}>
                  Need some help with this task?
                </button>
              </strong>
            </small>
          </p>
        </div>}
    </div>

  showHelp: ->
    alert <div className="content-container">
      <Markdown className="classification-task-help">{@props.help}</Markdown>
    </div>
