React = require 'react'
createReactClass = require 'create-react-class'
GenericTaskEditor = require '../generic-editor'
Summary = require('./summary').default
MarkingInitializer = require './marking-initializer'
MarkingsRenderer = require './markings-renderer'
HidePreviousMarksToggle = require('./hide-previous-marks-toggle').default
GenericTask = require('../generic.jsx').default
{Markdown} = require 'markdownz'
icons = require './icons'
drawingTools = require '../../drawing-tools'
GridButtons = require './grid-buttons'
SVGRenderer = require('../../annotation-renderer/svg').default
TaskInputField = require('../components/TaskInputField').default
DrawingToolInputIcon = require('./components/DrawingToolInputIcon').default
DrawingToolInputStatus = require('./components/DrawingToolInputStatus').default

module.exports = createReactClass
  displayName: 'DrawingTask'

  statics:
    Editor: GenericTaskEditor
    Summary: Summary
    InsideSubject: MarkingInitializer
    PersistInsideSubject: MarkingsRenderer
    PersistAfterTask: HidePreviousMarksToggle
    AnnotationRenderer: SVGRenderer

    getSVGProps: ({task})->
      if task?.type is 'drawing'
        style:
          pointerEvents: 'all'
          touchAction: 'pinch-zoom'
      else
        {}

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
      if task.tools[annotation._toolIndex].type == 'grid'
        for mark in annotation.value
          return true if mark._type is 'grid'
        return true if annotation._completed is true
        return false
      annotation.value.forEach (mark) ->
        marksByTool[mark.tool] ?= 0
        marksByTool[mark.tool] += 1
      task.tools.every (toolDescription, i) ->
        (marksByTool[i] ? 0) >= (toolDescription.min ? 0)

    areMarksComplete: (task, annotation) ->
      tasks = require('..').default # Circular
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

  getDefaultProps: ->
    task:
      tools: []
    annotation: null
    onChange: Function.prototype

  tools: ->
    @props.task.tools.map (tool, i) =>
      tool._key ?= Math.random()
      marksByType = @props.annotation.value.filter (mark) -> mark.tool is i
      count = marksByType.length
      translation = @props.translation.tools[i]
      checked = i is (@props.annotation._toolIndex ? 0)
      <div>
        <TaskInputField
          autoFocus={checked}
          checked={checked}
          className={if checked then 'active' else ''}
          index={i}
          key={tool._key}
          label={translation.label}
          labelIcon={<DrawingToolInputIcon tool={tool} />}
          labelStatus={<DrawingToolInputStatus count={count} tool={tool} />}
          name="drawing-tool"
          onChange={@handleChange.bind this, i}
          type="radio"
        />
        {if tool.type is 'grid'
          <GridButtons {...@props} />}
      </div>

  render: ->
    <GenericTask
      question={@props.translation.instruction}
      help={@props.translation.help}
      answers={@tools()}
      required={@props.task.required}
    />

  handleChange: (toolIndex, e) ->
    # This handles changing tools, not any actually drawing.
    # The annotation value is updated by the MarkingInitializer and the individual tools themselves.
    @constructor.closeAllMarks @props.task, @props.annotation
    if e.target.checked
      newAnnotation = Object.assign {}, @props.annotation, _toolIndex: toolIndex
      @props.onChange newAnnotation
