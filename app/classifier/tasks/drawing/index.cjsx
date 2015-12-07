React = require 'react'
GenericTaskEditor = require '../generic-editor'
Summary = require './summary'
MarkingInitializer = require './marking-initializer'
MarkingsRenderer = require './markings-renderer'
GenericTask = require '../generic'
testShapeCloseness = require 'test-shape-closeness'
{Markdown} = require 'markdownz'
icons = require './icons'
drawingTools = require '../../drawing-tools'

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

    closeAllMarks: (task, annotation) ->
      for mark in annotation.value
        toolDescription = task.tools[mark.tool]
        ToolComponent = drawingTools[toolDescription.type]
        if ToolComponent.isComplete? and ToolComponent.forceComplete?
            unless ToolComponent.isComplete mark
              ToolComponent.forceComplete mark

    onLeaveAnnotation: (task, annotation) ->
      @closeAllMarks task, annotation

    areMarksComplete: (task, annotation) ->
      tasks = require '..' # Circular
      for mark in annotation.value
        toolDescription = task.tools[mark.tool]
        for detail, i in toolDescription.details ? [] when detail.required
          subAnnotation = mark.details[i]
          DetailTaskComponent = tasks[detail.type]
          if DetailTaskComponent.isAnnotationComplete?
            unless DetailTaskComponent.isAnnotationComplete detail, subAnnotation
              return false
      true

    isAnnotationComplete: (task, annotation) ->
      # Booleans compare to numbers as expected: true = 1, false = 0. Undefined does not.
      @areMarksComplete(task, annotation) and annotation.value.length >= (task.required ? 0)

    testAnnotationQuality: (unknown, knownGood, workflow) ->
      unknownTaskDescription = workflow.tasks[unknown.task]
      unknownShapes = unknown.value.map (annotationShape) ->
        toolDescription = unknownTaskDescription.tools[annotationShape.tool]
        Object.assign {}, annotationShape, type: toolDescription.type

      knownGoodTaskDescription = workflow.tasks[knownGood.task]
      knownGoodShapes = knownGood.value.map (annotationShape) ->
        toolDescription = knownGoodTaskDescription.tools[annotationShape.tool]
        Object.assign {}, annotationShape, type: toolDescription.type

      # TODO: This doesn't factor in details tasks at all.
      testShapeCloseness unknownShapes.concat knownGoodShapes

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: Function.prototype

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

    <GenericTask question={@props.task.instruction} help={@props.task.help} answers={tools} required={@props.task.required} />

  handleChange: (index, e) ->
    @constructor.closeAllMarks @props.task, @props.annotation
    if e.target.checked
      @props.annotation._toolIndex = index
      @props.onChange? e
