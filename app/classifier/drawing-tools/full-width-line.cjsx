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
  displayName: 'FullWidthLineTool'

  statics:
    defaultValues: ({y}) ->
      y: y

    initMove: ({y}) ->
      y: y

    initValid: ({y}, {naturalHeight}) ->
      y >= 0 and y <= naturalHeight

  render: ->
    {y} = @props.mark
    points =
      x1: '0%'
      y1: y
      x2: '100%'
      y2: y
    {x1, y1, x2, y2} = points

    deletePosition =
      x: @props.containerRect.width / 2
      y: y

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
    @props.mark.y += difference.y
    @props.onChange @props.mark
