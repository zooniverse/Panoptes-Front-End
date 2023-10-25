React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Draggable = require('../../../lib/draggable').default
drawingTools = require '../../drawing-tools'

module.exports = createReactClass
  displayName: 'MarkingInitializer'

  contextTypes:
    geordi: PropTypes.object

  activeMarkIndex: -1

  getDefaultProps: ->
    annotation: null
    annotations: []
    workflow: null
    frame: 0
    getEventOffset: null

  render: ->
    toolDescription = @props.task.tools[@props.annotation._toolIndex]
    marksFromCurrentTool = @props.annotation.value.filter (mark) =>
      mark.tool is @props.annotation._toolIndex

    canMakeMarks = marksFromCurrentTool.length < (toolDescription.max ? Infinity)

    <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease} disabled={not canMakeMarks}>
      <rect className="marking-initializer" width={@props.naturalWidth} height={@props.naturalHeight} fill="transparent" stroke="none" />
    </Draggable>

  handleInitStart: (e) ->
    tasks = require('..').default # Circular

    taskDescription = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[@props.annotation.value.length - 1]

    markIsComplete = true
    if mark?
      toolDescription = taskDescription.tools[mark.tool]
      MarkComponent = drawingTools[toolDescription.type]
      if MarkComponent.isComplete?
        markIsComplete = MarkComponent.isComplete mark

    mouseCoords = @props.getEventOffset e

    if markIsComplete
      toolDescription = taskDescription.tools[@props.annotation._toolIndex]
      mark =
        tool: @props.annotation._toolIndex
        frame: @props.frame
      if toolDescription.details?
        mark.details = for detailTaskDescription in toolDescription.details
          tasks[detailTaskDescription.type].getDefaultAnnotation detailTaskDescription, @props.workflow, tasks

      @props.annotation.value.push mark

      MarkComponent = drawingTools[toolDescription.type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords, { naturalWidth: @props.naturalWidth, naturalHeight: @props.naturalHeight }
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    this.activeMarkIndex = @props.annotation.value.length - 1
    @onChange()

  handleInitDrag: (e) ->
    taskDescription = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[this.activeMarkIndex]
    MarkComponent = mark && drawingTools[taskDescription.tools[mark.tool].type]

    if mark and MarkComponent.initMove?
      mouseCoords = @props.getEventOffset e
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value

    @onChange()

  handleInitRelease: (e) ->
    pref = @props.preferences?.preferences ? {}
    taskDescription = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.value[this.activeMarkIndex]
    MarkComponent = mark && drawingTools[taskDescription.tools[mark?.tool].type]

    toolName = mark && taskDescription.tools[mark.tool].type

    if mark and MarkComponent.initRelease?
      mouseCoords = @props.getEventOffset e
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value

    if mark and MarkComponent.saveState? and pref.activeTemplate
      multipleMarks = MarkComponent.saveState mark, pref[pref.activeTemplate], pref.activeTemplate
      for multiple in multipleMarks
        @props.annotation.value.push multiple

        unless MarkComponent.initValid multiple, @props
          @destroyMark @props.annotation, multiple

    @onChange()

    if mark and MarkComponent.initValid?
      unless MarkComponent.initValid mark, @props
        this.activeMarkIndex = -1
        @destroyMark @props.annotation, mark

  destroyMark: (annotation, mark) ->
    if mark is @state?.selectedMark
      @setState selectedMark: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @onChange()
  
  onChange: () ->
    annotations = @props.annotations.slice()
    newAnnotation = annotations[annotations.length - 1]
    @props.onChange newAnnotation
