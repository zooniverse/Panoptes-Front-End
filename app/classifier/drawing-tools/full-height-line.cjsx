React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

GRAB_STROKE_WIDTH = 20
BUFFER = 16
DELETE_BUTTON_WIDTH = 8

module.exports = createReactClass
  displayName: 'FullHeightLineTool'

  statics:
    defaultValues: ({x}) ->
      x: x

    initMove: ({x}) ->
      x: x

    initValid: ({x}, {naturalWidth}) ->
      x >= 0 and x <= naturalWidth

  render: ->
    {x} = @props.mark
    points =
      x1: x
      y1: '0%'
      x2: x
      y2: '100%'
    {x1, y1, x2, y2} = points

    deletePosition =
      x: x
      y: @props.containerRect.height / 2

    <DrawingToolRoot tool={this}>
      <line {...points} />

      <Draggable onDrag={@handleStrokeDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <line {...points} strokeWidth={GRAB_STROKE_WIDTH / ((@props.scale.horizontal + @props.scale.vertical) / 2)} strokeOpacity="0" />
      </Draggable>

      {if @props.selected
        <g>
          <DeleteButton tool={this} x={deletePosition.x} y={deletePosition.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
        </g>}
    </DrawingToolRoot>

  handleStrokeDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.onChange @props.mark
