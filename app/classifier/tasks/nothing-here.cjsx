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
        {if @props.annotation.value?
          <div className="answer">
            <i className="fa fa-check-circle-o fa-fw"></i>
            <Markdown tag="span" inline={true}>{@props.task.answers[@props.annotation.value].label}</Markdown>
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
    task: null
    workflow: null

  getInitialState: ->
    index: null

  toggleShortcut: (i, shortcut, e) ->
    if e.target.checked
      @props.annotation.shortcut = {index: i}
      @setState index: i
    else
      @props.annotation.shortcut = false
      @setState index: null
    @props.classification.update 'annotations'

  render: ->
    options = @props.workflow.tasks[@props.task.unlinkedTask].answers

    <div>

      {for answer, i in options
          answer._key ?= Math.random()
          <p key={answer._key}>
            <label className="answer-button">
              <small className="nothing-here-shortcut #{if i is @state.index then 'active' else ''}">
                <strong>
                  <input type="checkbox" checked={i is @state.index} onChange={@toggleShortcut.bind this, i, answer} />
                    {answer.label}
                </strong>
              </small>
            </label>
          </p>}

    </div>
