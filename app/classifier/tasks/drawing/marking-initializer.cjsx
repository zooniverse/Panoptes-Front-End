React = require 'react'
Draggable = require '../../../lib/draggable'
drawingTools = require '../../drawing-tools'

module.exports = React.createClass
  displayName: 'MarkingInitializer'

  getDefaultProps: ->
    annotation: null
    workflow: null
    frame: 0
    getEventOffset: null

  render: ->
    <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
      <rect className="marking-initializer" width="100%" height="100%" fill="transparent" stroke="none" />
    </Draggable>

  handleInitStart: (e) ->
    tasks = require '..' # Circular

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
          tasks[detailTaskDescription.type].getDefaultAnnotation()

      @props.annotation.value.push mark
      @selectMark @props.annotation, mark

      MarkComponent = drawingTools[toolDescription.type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    setTimeout =>
      @props.classification.update 'annotations'

  handleInitDrag: (e) ->
    console.log 'INIT DRAG'
    return
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @state.selectedMark
    MarkComponent = drawingTools[task.tools[mark.tool].type]
    if MarkComponent.initMove?
      mouseCoords = @props.getEventOffset e
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value
    @updateAnnotations()

  handleInitRelease: (e) ->
    console.log 'INIT RELEASE'
    return
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @state.selectedMark
    MarkComponent = drawingTools[task.tools[mark.tool].type]
    if MarkComponent.initRelease?
      mouseCoords = @props.getEventOffset e
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value
    @updateAnnotations()
    if MarkComponent.initValid? and not MarkComponent.initValid mark
      @destroyMark @props.annotation, mark

  selectMark: (annotation, mark) ->
    if annotation? and mark?
      index = annotation.value.indexOf mark
      annotation.value.splice index, 1
      annotation.value.push mark
    # @setState selectedMark: mark, =>
    #   @handleResize() if mark?.details? # hack to show the details box

  destroyMark: (annotation, mark) ->
    if mark is @state.selectedMark
      @setState selectedMark: null
    markIndex = annotation.value.indexOf mark
    annotation.value.splice markIndex, 1
    @updateAnnotations()
