React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
drawingTools = require '../drawing-tools'

NextTaskSelector = React.createClass
  displayName: 'NextTaskSelector'

  getDefaultProps: ->
    workflow: null
    name: ''
    value: ''
    onChange: null

  render: ->
    <select name={@props.name} value={@props.value} onChange={@props.onChange}>
      <option value="">(End of classification!)</option>
      {for key, definition of @props.workflow.tasks
        <option key={key}, value={key}>{key}</option>}
    </select>

module.exports = React.createClass
  displayName: 'GenericTaskEditor'

  getDefaultProps: ->
    workflow: null
    taskKey: ''

  render: ->
    definition = @props.workflow.tasks[@props.taskKey]
    handleChange = handleInputChange.bind @props.workflow

    [mainTextKey, choicesKey] = switch definition.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']

    <div className="workflow-task-editor #{definition.type}">
      <div className="columns-container">
        <div>
          <span className="form-label">Main text</span><br />
          <textarea name="tasks.#{@props.taskKey}.#{mainTextKey}" value={definition[mainTextKey]} className="standard-input full" onChange={handleChange} />
        </div>

        <div>
          <span className="form-label">Help text</span><br />
          <textarea name="tasks.#{@props.taskKey}.help" value={definition.help ? ''} className="standard-input full" onChange={handleChange} />
        </div>
      </div>

      <hr />

      <span className="form-label">Choices</span>
      {' '}
      {if choicesKey is 'answers'
        [<label key="multiple" className="pill-button">
          <input type="checkbox" checked={definition.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
          Multiple choice
        </label>
        {' '}
        <label key="required" className="pill-button">
          <input type="checkbox" name="tasks.#{@props.taskKey}.required" checked={definition.required} onChange={handleChange} />{' '}
          Required
        </label>]}
        <br />

      <div className="workflow-task-editor-choices">
        {for choice, index in definition[choicesKey]
          choice._key ?= Math.random()
          <div key={choice._key} className="workflow-choice-editor">
            <textarea name="tasks.#{@props.taskKey}.#{choicesKey}.#{index}.label" value={choice.label} className="standard-input full" onChange={handleChange} />

            <div className="workflow-choice-settings">
              {switch definition.type
                when 'single'
                  <div className="workflow-choice-setting">
                    Next task{' '}
                    <NextTaskSelector workflow={@props.workflow} name="tasks.#{@props.taskKey}.#{choicesKey}.#{index}.next" value={choice.next ? ''} onChange={handleChange} />
                  </div>

                when 'drawing'
                  [<div key={choice.type} className="workflow-choice-setting">
                    Type{' '}
                    <select name="tasks.#{@props.taskKey}.#{choicesKey}.#{index}.type" value={choice.type} onChange={handleChange}>
                      {for toolName of drawingTools
                        <option value={toolName}>{toolName}</option>}
                    </select>
                  </div>

                  <div key={choice.color} className="workflow-choice-setting">
                    Color{' '}
                    <select name="tasks.#{@props.taskKey}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
                      <option value="#ff0000">Red</option>
                      <option value="#ffff00">Yellow</option>
                      <option value="#00ff00">Green</option>
                      <option value="#00ffff">Cyan</option>
                      <option value="#0000ff">Blue</option>
                      <option value="#ff00ff">Magenta</option>
                      <option value="#000000">Black</option>
                      <option value="#ffffff">White</option>
                      <option disabled>TODO: Picker</option>
                    </select>
                  </div>

                  <div key="details" className="workflow-choice-setting">
                    <small className="form-help">TODO: Add a details editor, probably in a popup.</small>
                  </div>]}
            </div>
            <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, choicesKey, index}>&times;</button>
          </div>}

        <button type="button" className="workflow-choice-add-button" title="Add choice" onClick={@addChoice.bind this, choicesKey}>+</button>
      </div>

      {unless definition.type is 'single'
        <div>
          Next task
          <NextTaskSelector workflow={@props.workflow} name="tasks.#{@props.taskKey}.next" value={definition.next ? ''} onChange={handleChange} />{' '}
          {if definition.next is @props.taskKey
            <span className="form-help warning"><i className="fa fa-exclamation-triangle"></i> Infinite loop</span>}
        </div>}

      <small><button type="button" className="minor-button" onClick={@removeTask}>Remove task</button></small>
    </div>

  toggleMultipleChoice: (e) ->
    type = if e.target.checked
      'multiple'
    else
      'single'

    changes = {}
    changes["tasks.#{@props.taskKey}.type"] = type
    @props.workflow.update changes

  addChoice: (type) ->
    switch type
      when 'answers' then @addAnswer()
      when 'tools' then @addTool()

  addAnswer: ->
    nextIndex = @props.workflow.tasks[@props.taskKey].answers.length

    changes = {}
    changes["tasks.#{@props.taskKey}.answers.#{nextIndex}"] =
      label: 'Enter an answer'
      next: null

    @props.workflow.update changes

  addTool: ->
    nextIndex = @props.workflow.tasks[@props.taskKey].tools.length

    changes = {}
    changes["tasks.#{@props.taskKey}.tools.#{nextIndex}"] =
      type: 'point'
      label: 'Tool name'
      color: '#00ff00'

    @props.workflow.update changes

  removeChoice: (choicesName, index) ->
    changes = {}
    changes["tasks.#{@props.taskKey}.#{choicesName}.#{index}"] = undefined
    @props.workflow.update changes

  removeTask: ->
    changes = {}
    changes["tasks.#{@props.taskKey}"] = undefined
    @props.workflow.update changes

    if @props.workflow.first_task not of @props.workflow.tasks
      @props.workflow.update first_task: Object.keys(@props.workflow.tasks)[0] ? ''
