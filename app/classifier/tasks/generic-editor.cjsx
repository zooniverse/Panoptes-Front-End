React = require 'react'
ChangeListener = require '../../components/change-listener'
AutoSave = require '../../components/auto-save'
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
    taskPrefix: ''

  render: ->
    handleChange = handleInputChange.bind @props.workflow

    [mainTextKey, choicesKey] = switch @props.task.type
      when 'single', 'multiple' then ['question', 'answers']
      when 'drawing' then ['instruction', 'tools']

    <div className="workflow-task-editor #{@props.task.type}">
      <div>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Main text</span>
          <br />
          <textarea name="#{@props.taskPrefix}.#{mainTextKey}" value={@props.task[mainTextKey]} className="standard-input full" onChange={handleChange} />
        </AutoSave>
        <small className="form-help">Describe the task, or ask the question, in a way that is clear to a non-expert. You can use markdown to format this text.</small><br />
      </div>
      <br />

      {unless @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            <span className="form-label">Help text</span>
            <br />
            <textarea  name="#{@props.taskPrefix}.help" value={@props.task.help} rows="7" className="standard-input full" onChange={handleChange} />
          </AutoSave>
          <small className="form-help">Add text and images for a window that pops up when volunteers click “Need some help?” You can use markdown to format this text and add images. The help text can be as long as you need, but you should try to keep it simple and avoid jargon.</small>
        </div>}

      <hr />

      <span className="form-label">Choices</span>
      {' '}
      {if choicesKey is 'answers'
        multipleHelp = 'Multiple Choice: Check this box if more than one answer can be selected.'
        requiredHelp = 'Check this box if this question has to be answered before proceeding. If a marking task is Required, the volunteer will not be able to move on until they have made at least 1 mark.'

        [<label key="multiple" className="pill-button">
          <AutoSave resource={@props.workflow}>
            <input type="checkbox" checked={@props.task.type is 'multiple'} onChange={@toggleMultipleChoice} />{' '}
            Allow multiple
          </AutoSave>
        </label>
        {' '}
        <label key="required" className="pill-button" title={requiredHelp}>
          <AutoSave resource={@props.workflow}>
            <input type="checkbox" name="#{@props.taskPrefix}.required" checked={@props.task.required} onChange={handleChange} />{' '}
            Required
          </AutoSave>
        </label>]}
        <br />

      <div className="workflow-task-editor-choices">
        {if (@props.task[choicesKey]?.length ? 0) is 0 # Work around the empty-array-becomes-null bug on the back end.
          <span className="form-help">No <code>{choicesKey}</code> defined for this task.</span>}
        {for choice, index in @props.task[choicesKey] ? []
          choice._key ?= Math.random()
          <div key={choice._key} className="workflow-choice-editor">
            <AutoSave resource={@props.workflow}>
              <textarea name="#{@props.taskPrefix}.#{choicesKey}.#{index}.label" value={choice.label} onChange={handleChange} />
            </AutoSave>

            <div className="workflow-choice-settings">
              {switch @props.task.type
                when 'single'
                  unless @props.isSubtask
                    <div className="workflow-choice-setting">
                      <AutoSave resource={@props.workflow}>
                        Next task{' '}
                        <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.#{choicesKey}.#{index}.next" value={choice.next ? ''} onChange={handleChange} />
                      </AutoSave>
                    </div>

                when 'drawing'
                  [<div key="type" className="workflow-choice-setting">
                    <AutoSave resource={@props.workflow}>
                      Type{' '}
                      <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.type" value={choice.type} onChange={handleChange}>
                        {for toolKey of drawingTools
                          <option key={toolKey} value={toolKey}>{toolKey}</option>}
                      </select>
                    </AutoSave>
                  </div>

                  <div key="color" className="workflow-choice-setting">
                    <AutoSave resource={@props.workflow}>
                      Color{' '}
                      <select name="#{@props.taskPrefix}.#{choicesKey}.#{index}.color" value={choice.color} onChange={handleChange}>
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
                    </AutoSave>
                  </div>

                  <div key="details" className="workflow-choice-setting">
                    <button type="button" onClick={@editToolDetails.bind this, @props.task, index}>Sub-tasks ({choice.details?.length ? 0})</button>{' '}
                    <small className="form-help">Ask users a question about what they’ve just drawn.</small>
                  </div>]}
            </div>

            <AutoSave resource={@props.workflow}>
              <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, choicesKey, index}>&times;</button>
            </AutoSave>
          </div>}

        <AutoSave resource={@props.workflow}>
          <button type="button" className="workflow-choice-add-button" title="Add choice" onClick={@addChoice.bind this, choicesKey}>+</button>
        </AutoSave>
        <br />

        {switch choicesKey
          when 'answers'
            <div>
              <small className="form-help">The answers will be displayed next to each checkbox, so this text is as important as the main text and help text for guiding the volunteers. Keep your answers as minimal as possible -- any more than 5 answers can discourage new users.</small><br />
              <small className="form-help">The “Next task” selection describes what task you want the volunteer to perform next after they give a particular answer. You can choose from among the tasks you’ve already defined. If you want to link a task to another you haven’t built yet, you can come back and do it later (don’t forget to save your changes).</small>
            </div>
          when 'tools'
            <div>
              <small className="form-help">Select which marks you want for this task, and what to call each of them. The tool name will be displayed on the classification page next to each marking option. Use the simplest tool that will give you the results you need for your research.</small><br />
              <small className="form-help">*point:* X marks the spot.</small><br />
              <small className="form-help">*line:* a straight line at any angle.</small><br />
              <small className="form-help">*polygon:* an arbitrary shape made of point-to-point lines.</small><br />
              <small className="form-help">*rectangle:* a box of any size and length-width ratio; this tool *cannot* be rotated.</small><br />
              <small className="form-help">*circle:* a point and a radius.</small><br />
              <small className="form-help">*ellipse:* an oval of any size and axis ratio; this tool *can* be rotated.</small><br />
            </div>}
      </div>

      {unless @props.task.type is 'single' or @props.isSubtask
        <div>
          <AutoSave resource={@props.workflow}>
            Next task{' '}
            <NextTaskSelector workflow={@props.workflow} name="#{@props.taskPrefix}.next" value={@props.task.next ? ''} onChange={handleChange} />
          </AutoSave>
        </div>}

      <hr />

      <div>
        <AutoSave resource={@props.workflow}>
          <small>
            <button type="button" className="minor-button" onClick={@props.onDelete}>Remove task</button>
          </small>
        </AutoSave>
      </div>
    </div>

  toggleMultipleChoice: (e) ->
    newType = if e.target.checked
      'multiple'
    else
      'single'
    @props.task.type = newType
    @props.workflow.update 'tasks'

  addChoice: (type) ->
    switch type
      when 'answers' then @addAnswer()
      when 'tools' then @addTool()

  addAnswer: ->
    @props.task.answers ?= []
    @props.task.answers.push
      label: 'Enter an answer'
    @props.workflow.update 'tasks'

  addTool: ->
    @props.task.tools.push
      type: 'point'
      label: 'Tool name'
      color: '#00ff00'
      details: []
    @props.workflow.update 'tasks'

  editToolDetails: (task, toolIndex) ->
    @props.task.tools[toolIndex].details ?= []

    alert (resolve) =>
      <ChangeListener target={@props.workflow}>{=>
        <DrawingTaskDetailsEditor
          workflow={@props.workflow}
          task={@props.task}
          toolIndex={toolIndex}
          details={@props.task.tools[toolIndex].details}
          toolPath="#{@props.taskPrefix}.tools.#{toolIndex}"
          onClose={resolve}
        />
      }</ChangeListener>

  removeChoice: (choicesName, index) ->
    @props.task[choicesName].splice index, 1
    @props.workflow.update 'tasks'
