React = require 'react'
handleInputChange = require '../../lib/handle-input-change'

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

    [mainText, choices] = switch definition.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']

    <div className="workflow-task-editor #{definition.type}">
      <div className="columns-container">
        <div>
          Main text<br />
          <textarea name="tasks.#{@props.taskKey}.#{mainText}" value={definition[mainText]} className="standard-input full" onChange={handleChange} />
        </div>

        <div>
          Help text<br />
          <textarea name="tasks.#{@props.taskKey}.help" value={definition.help ? ''} className="standard-input full" onChange={handleChange} />
        </div>
      </div>

      Choices{' '}
      {if choice is 'answers'
        [<label key="multiple">
          <input type="checkbox" checked={definition.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
          Multiple choice
        </label>&emsp;

        <label key="required">
          <input type="checkbox" name="tasks.#{@props.taskKey}.required" checked={definition.required} onChange={handleChange} />{' '}
          Required
        </label>]}
      <br />

      <div className="workflow-task-editor-choices">
        {for choice, index in definition[choices]
          choice._key ?= Math.random()
          <div key={choice._key} className="workflow-choice-editor">
            <textarea name="tasks.#{@props.taskKey}.#{choices}.#{index}.label" value={choice.label} onChange={handleChange} />
            <div className="workflow-choice-settings">
              {switch definition.type
                when 'single'
                  <div className="workflow-choice-setting">
                    Next task{' '}
                    <NextTaskSelector workflow={@props.workflow} name="tasks.#{@props.taskKey}.#{choices}.#{index}.next" value={choice.next ? ''} onChange={handleChange} />
                  </div>

                when 'drawing'
                  [<div key={choice.type} className="workflow-choice-setting">
                    Type{' '}
                    <select name="tasks.#{@props.taskKey}.#{choices}.#{index}.type" value={choice.type} onChange={handleChange}>
                      <option>Point</option>
                      <option disabled>TODO: List available drawing tools.</option>
                    </select>
                  </div>

                  <div key={choice.color} className="workflow-choice-setting">
                    Color{' '}
                    <select name="tasks.#{@props.taskKey}.#{choices}.#{index}.color" value={choice.color} onChange={handleChange}>
                      <option value="#ff0000">Red</option>
                      <option value="#ffff00">Yellow</option>
                      <option value="#00ff00">Green</option>
                      <option value="#00ffff">Cyan</option>
                      <option value="#0000ff">Blue</option>
                      <option value="#ff00ff">Magenta</option>
                      <option value="#000000">Black</option>
                      <option value="#ffffff">White</option>
                      <option disabled>TODO: Use a real color picker.</option>
                    </select>
                  </div>

                  <div key="details" className="workflow-choice-setting">
                    <small className="form-help">TODO: Add a details editor, maybe in a tooltip.</small>
                  </div>]}

            </div>
            <button type="button" onClick={@removeChoice.bind this, choices, index}>Remove choice</button>
          </div>}
        <button type="button" onClick={@addChoice.bind this, choices}>Add</button>
      </div>

      {unless definition.type is 'single'
        <div>
          Next task
          <NextTaskSelector workflow={@props.workflow} name="tasks.#{@props.taskKey}.next" value={definition.next ? ''} onChange={handleChange} />{' '}
          {if definition.next is @props.taskKey
            <span className="form-help warning"><i className="fa fa-exclamation-triangle"></i> Infinite loop</span>}
        </div>}

      <button type="button" onClick={@removeTask}>Remove task</button>
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
