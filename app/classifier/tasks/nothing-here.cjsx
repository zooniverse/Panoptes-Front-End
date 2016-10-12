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

  getDefaultProps: ->
    annotation: null
    classification: null
    options: []
    task: null
    workflow: null

  componentWillReceiveProps: (nextProps) ->
    if nextProps.annotation.shortcut
      if nextProps.annotation.value instanceof Array
        @removeShortcuts(nextProps) if nextProps.annotation.value?.length > 0
      else if nextProps.annotation.value isnt null
        @removeShortcuts(nextProps)

  removeShortcuts: (newProps) ->
    newProps.annotation.shortcut = false
    newProps.classification.update 'annotations'

  toggleShortcut: (index, shortcut, e) ->
    if e.target.checked
      @props.annotation.shortcut = shortcut.label
      if @props.annotation.value instanceof Array
        @props.annotation.value = []
      else
        @props.annotation.value = null
    else
      @props.annotation.shortcut = false
    @props.classification.update 'annotations'

  render: ->
    shortcuts = @props.workflow.tasks[@props.task.unlinkedTask].answers

    <div>

      {for shortcut, index in shortcuts
          shortcut._key ?= Math.random()
          <p key={shortcut._key}>
            <label className="answer-button">
              <small className="nothing-here-shortcut #{if shortcut.label is @props.annotation.shortcut then 'active' else ''}">
                <strong>
                  <input type="checkbox" checked={shortcut.label is @props.annotation.shortcut} onChange={@toggleShortcut.bind this, index, shortcut} />
                    {shortcut.label}
                </strong>
              </small>
            </label>
          </p>}

    </div>
