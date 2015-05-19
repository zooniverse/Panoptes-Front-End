React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
drawingTools = require '../drawing-tools'
alert = require '../../lib/alert'
DrawingTaskDetailsEditor = require './drawing-task-details-editor'

NOOP = Function.prototype

MAX_TEXT_LENGTH_IN_MENU = 100

NextTaskSelector = React.createClass
  displayName: 'NextTaskSelector'

  getDefaultProps: ->
    workflow: null
    name: ''
    value: ''
    isSubtask: false
    onChange: NOOP
    onDelete: NOOP

  render: ->
    tasks = require '.' # Work around circular dependency.

    <select name={@props.name} value={@props.value} onChange={@props.onChange}>
      <option value="">(End of classification!)</option>
      {for key, definition of @props.workflow.tasks
        text = tasks[definition.type].getTaskText definition
        if text.length > MAX_TEXT_LENGTH_IN_MENU
          text = text[0...MAX_TEXT_LENGTH_IN_MENU] + '...'
        <option key={key}, value={key}>{text}</option>}
    </select>

module.exports = React.createClass
  displayName: 'GenericTaskEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    onChange: NOOP

  render: ->
    [mainTextKey, choicesKey] = switch @props.task.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']

    <div className="workflow-task-editor #{@props.task.type}">
      <div>
        <span className="form-label">Main text</span><br />
        <textarea name={mainTextKey} value={@props.task[mainTextKey]} className="standard-input full" onChange={@handleInputChange} />
      </div>

      {unless @props.isSubtask
        <div>
          <span className="form-label">Help text</span><br />
          <textarea name="help" value={@props.task.help ? ''} rows={7} className="standard-input full" onChange={@handleInputChange} />
        </div>}

      <hr />

      <span className="form-label">Choices</span>
      {' '}
      {if choicesKey is 'answers'
        [<label key="multiple" className="pill-button">
          <input type="checkbox" checked={@props.task.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
          Multiple choice
        </label>
        {' '}
        <label key="required" className="pill-button">
          <input type="checkbox" name="required" checked={@props.task.required} onChange={@handleInputChange} />{' '}
          Required
        </label>]}
        <br />

      <div className="workflow-task-editor-choices">
        {if (@props.task[choicesKey]?.length ? 0) is 0 # Work around the empty-array-becomes-null bug on the back end.
          <span className="form-help">No <code>{choicesKey}</code> defined for this task.</span>}
        {for choice, index in @props.task[choicesKey] ? []
          choice._key ?= Math.random()
          <div key={choice._key} className="workflow-choice-editor">
            <textarea name="#{choicesKey}.#{index}.label" value={choice.label} className="standard-input full" onChange={@handleInputChange} />

            <div className="workflow-choice-settings">
              {switch @props.task.type
                when 'single'
                  unless @props.isSubtask
                    <div className="workflow-choice-setting">
                      Next task{' '}
                      <NextTaskSelector workflow={@props.workflow} name="#{choicesKey}.#{index}.next" value={choice.next ? ''} onChange={@handleInputChange} />
                    </div>

                when 'drawing'
                  [<div key={choice.type} className="workflow-choice-setting">
                    Type{' '}
                    <select name="#{choicesKey}.#{index}.type" value={choice.type} onChange={@handleInputChange}>
                      {for toolKey of drawingTools
                        <option key={toolKey} value={toolKey}>{toolKey}</option>}
                    </select>
                  </div>

                  <div key={choice.color} className="workflow-choice-setting">
                    Color{' '}
                    <select name="#{choicesKey}.#{index}.color" value={choice.color} onChange={@handleInputChange}>
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
                    <button type="button" onClick={@editToolDetails.bind this, @props.task, index}>Set up details ({choice.details?.length ? 0})</button>
                  </div>]}
            </div>
            <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, choicesKey, index}>&times;</button>
          </div>}

        <button type="button" className="workflow-choice-add-button" title="Add choice" onClick={@addChoice.bind this, choicesKey}>+</button>
      </div>

      {unless @props.task.type is 'single' or @props.isSubtask
        <div>
          Next task{' '}
          <NextTaskSelector workflow={@props.workflow} name="next" value={@props.task.next ? ''} onChange={@handleInputChange} />
        </div>}

      <hr />

      <div>
        <small><button type="button" className="minor-button" onClick={@props.onDelete}>Remove task</button></small>
      </div>
    </div>

  handleInputChange: (e) ->
    @props.onChange e.target.name, e.target.checked ? e.target.value, arguments...

  toggleMultipleChoice: (e) ->
    @props.onChange 'type', if e.target.checked
      'multiple'
    else
      'single'

  addChoice: (type) ->
    switch type
      when 'answers' then @addAnswer()
      when 'tools' then @addTool()

  addAnswer: ->
    nextIndex = @props.task.answers.length
    @props.onChange "answers.#{nextIndex}",
      label: 'Enter an answer'

  addTool: ->
    nextIndex = @props.task.tools.length
    @props.onChange "tools.#{nextIndex}",
      type: 'point'
      label: 'Tool name'
      color: '#00ff00'
      details: []

  editToolDetails: (task, toolIndex) ->
    unless @props.task.tools[toolIndex].details?
      @props.onChange "tools.#{toolIndex}.details", []

    alert (resolve) =>
      <DrawingTaskDetailsEditor workflow={@props.workflow} task={task}, toolIndex={toolIndex} onClose={resolve} />

  removeChoice: (choicesName, index) ->
    @props.onChange "#{choicesName}.#{index}", undefined
