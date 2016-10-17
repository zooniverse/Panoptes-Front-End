React = require 'react'
{Markdown} = (require 'markdownz').default

Summary = React.createClass
  displayName: 'NothingHereSummary'

  getDefaultProps: ->
    annotation: null
    task: null

  render: ->
    <div>
      <div className="question">
        {@props.task.question}
      </div>
      <div className="answers">
        {if @props.annotation.value['shortcut']
          <div className="answer">
            <i className="fa fa-check-circle-o fa-fw"></i>
            <Markdown tag="span" inline={true}>{@props.annotation.value['shortcut']}</Markdown>
          </div>
        else
          <div className="answer">No answer</div>}
      </div>
    </div>


module.exports = React.createClass
  displayName: 'NothingHere'

  statics:
    Summary: Summary

    getDefaultTask: (question) ->
      answers: []
      type: 'nothingHere'
      question: question

    getDefaultAnnotation: ->
      _key: Math.random()
      value: null

  getDefaultProps: ->
    annotation: null
    classification: null
    options: []
    task: null
    workflow: null

  toggleShortcut: (index, shortcut, e) ->
    if e.target.checked
      @props.annotation.shortcut = shortcut
    else
      @props.annotation.shortcut = false
    @props.classification.update 'annotations'

  render: ->
    options = @props.workflow.tasks[@props.task.unlinkedTask].answers
    shortcut = @props.annotation.shortcut

    <div>

      {for option, index in options
          option._key ?= Math.random()
          <p key={option._key}>
            <label className="answer-button">
              <small className="nothing-here-shortcut #{if option.label is shortcut?.label then 'active' else ''}">
                <strong>
                  <input type="checkbox" checked={option.label is shortcut?.label} onChange={@toggleShortcut.bind this, index, option} />
                    {option.label}
                </strong>
              </small>
            </label>
          </p>}

    </div>
