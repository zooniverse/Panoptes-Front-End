React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
DragHandle = require './drag-handle'
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

DEFAULT_WIDTH = 25
MINIMUM_WIDTH = 25

module.exports = createReactClass
  displayName: 'RectangleTool'

  statics:
    initCoords: null

    defaultValues: ({x}) ->
      x: x
      width: DEFAULT_WIDTH

    initStart: ({x}, mark) ->
      @initCoords = {x, 0}
      {x, 0, _inProgress: true}

    initMove: (cursor, mark) ->
      if cursor.x > @initCoords.x
        width = cursor.x - mark.x
        x = mark.x
      else
        width = @initCoords.x - cursor.x
        x = cursor.x

      {x, width}

    initRelease: ->
      _inProgress: false

    initValid: (mark) ->
      mark.width >= MINIMUM_WIDTH

  initCoords: null

  render: ->
    {x, width} = @props.mark

    <DrawingToolRoot tool={this}>
      <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <rect ref="rect" x={x} y={0} width={width} height={@props.containerRect.height / @props.scale.vertical} />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={x + width + 20} y={15} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />

          <DragHandle x={x} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleLeftDrag} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          <DragHandle x={x + width} y={(@props.containerRect.height / @props.scale.vertical) / 2} scale={@props.scale} onDrag={@handleRightDrag} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.onChange @props.mark

  handleLeftDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    if @props.mark.width - difference.x >= MINIMUM_WIDTH
      @props.mark.x += difference.x
      @props.mark.width -= difference.x 
      @props.onChange @props.mark

  handleRightDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    if @props.mark.width + difference.x >= MINIMUM_WIDTH
      @props.mark.width += difference.x
      @props.onChange @props.mark
