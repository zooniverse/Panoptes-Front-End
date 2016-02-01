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

    areThereEnoughMarks:(task, annotation) ->
      marksByTool = {}
      annotation.value.forEach (mark) ->
        marksByTool[mark.tool] ?= 0
        marksByTool[mark.tool] += 1
      task.tools.every (toolDescription, i) ->
        (marksByTool[i] ? 0) >= (toolDescription.min ? 0)

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
      @areMarksComplete(task, annotation) and @areThereEnoughMarks(task, annotation) and annotation.value.length >= (task.required ? 0)

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
      <label key={tool._key} className="minor-button answer-button #{if i is (@props.annotation._toolIndex ? 0) then 'active' else ''}">
        <div className="answer-button-icon-container">
          <input type="radio" className="drawing-tool-button-input" checked={i is (@props.annotation._toolIndex ? 0)} onChange={@handleChange.bind this, i} />
          <span className="drawing-tool-button-icon" style={color: tool.color}>{icons[tool.type]}</span>
        </div>

        <div className="answer-button-label-container">
          <Markdown className="answer-button-label">{tool.label}</Markdown>
          <div className="answer-button-status">
            {count + ' '}
            {if tool.min? or tool.max?
              'of '}
            {if tool.min?
              <span style={color: 'red' if count < tool.min}>{tool.min} required</span>}
            {if tool.min? and tool.max?
              ', '}
            {if tool.max?
              <span style={color: 'orange' if count is tool.max}>{tool.max} maximum</span>}
            {' '}drawn
          </div>
        </div>
      </label>

    <GenericTask question={@props.task.instruction} help={@props.task.help} answers={tools} required={@props.task.required} />

  handleChange: (toolIndex, e) ->
    # This handles changing tools, not any actually drawing.
    # The annotation value is updated by the MarkingInitializer and the individual tools themselves.
    @constructor.closeAllMarks @props.task, @props.annotation
    if e.target.checked
      newAnnotation = Object.assign {}, @props.annotation, _toolIndex: toolIndex
      @props.onChange newAnnotation
