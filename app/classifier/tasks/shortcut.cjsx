React = require 'react'
{Markdown} = require 'markdownz'

Summary = React.createClass
  displayName: 'ShortcutSummary'

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
  displayName: 'Shortcut'

  statics:
    Summary: Summary

    getDefaultTask: (question) ->
      answers: []
      type: 'shortcut'
      question: question

    getDefaultAnnotation: ->
      _key: Math.random()
      value: null

  getDefaultProps: ->
    annotation: 
      task: null
      value: null
    classification: null
    task:
      unlinkedTask: null
    workflow:
      tasks:[]

  getInitialState: ->
    index: null

  componentWillReceiveProps: (nextProps) ->
    if nextProps.annotation.task isnt @props.annotation.task
      @setState index: null

  toggleShortcut: (i, shortcut, e) ->
    if e.target.checked
      @props.annotation.shortcut = {index: i}
      @setState index: i
    else
      delete @props.annotation.shortcut
      @setState index: null
    @props.classification.update 'annotations'

  render: ->
    options = @props.workflow.tasks[@props.task.unlinkedTask]?.answers
    options ?= []

    <div className="unlinked-shortcut">

      {for answer, i in options
          answer._key ?= Math.random()
          <p key={answer._key}>
            <label key={answer._key} className="answer minor-button answer-button #{if i is @state.index then 'active' else ''}">
              <small>
                <strong>
                  <input type="checkbox" checked={i is @state.index} onChange={@toggleShortcut.bind this, i, answer} />
                    {' '}{answer.label}
                </strong>
              </small>
            </label>
          </p>}

    </div>
