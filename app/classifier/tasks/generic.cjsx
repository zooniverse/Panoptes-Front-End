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
          cloneWithProps answer,  className: 'answer'}
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
                  Need some help?
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
