React = require 'react'
GenericTaskEditor = require '../generic-editor'
Summary = require './summary'
MarkingInitializer = require './marking-initializer'
MarkingsRenderer = require './markings-renderer'
GenericTask = require '../generic'
{Markdown} = require 'markdownz'
icons = require './icons'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'DrawingTask'

  statics:
    Editor: GenericTaskEditor
    Summary: Summary
    InsideSubject: MarkingInitializer
    PersistInsideSubject: MarkingsRenderer

    getDefaultTask: ->
      type: 'drawing'
      instruction: 'Explain what to draw.'
      help: ''
      tools: []

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      _toolIndex: 0
      value: []

    areMarksComplete: (task, annotation) ->
      tasks = require '..' # Circular
      for mark in annotation.value
        toolDescription = task.tools[mark.tool]
        for detail, i in toolDescription.details when detail.required
          subAnnotation = mark.details[i]
          DetailTaskComponent = tasks[detail.type]
          if DetailTaskComponent.isAnnotationComplete?
            unless DetailTaskComponent.isAnnotationComplete detail, subAnnotation
              return false
      true

    isAnnotationComplete: (task, annotation) ->
      # Booleans compare to numbers as expected: true = 1, false = 0. Undefined does not.
      @areMarksComplete(task, annotation) and annotation.value.length >= (task.required ? 0)

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: NOOP

  render: ->
    tools = for tool, i in @props.task.tools
      tool._key ?= Math.random()
      count = (true for mark in @props.annotation.value when mark.tool is i).length
      <label key={tool._key} className="minor-button #{if i is (@props.annotation._toolIndex ? 0) then 'active' else ''}">
        <span className="drawing-tool-icon" style={color: tool.color}>{icons[tool.type]}</span>{' '}
        <input type="radio" className="drawing-tool-input" checked={i is (@props.annotation._toolIndex ? 0)} onChange={@handleChange.bind this, i} />
        <Markdown>{tool.label}</Markdown>
        {unless count is 0
          <span className="tool-count">({count})</span>}
      </label>

    <GenericTask question={@props.task.instruction} help={@props.task.help} answers={tools} />

  handleChange: (index, e) ->
    if e.target.checked
      @props.annotation._toolIndex = index
      @props.onChange? e
