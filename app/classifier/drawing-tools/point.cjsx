React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

STROKE_WIDTH = 1.5
RADIUS = 10
SELECTED_RADIUS = 20
DELETE_BUTTON_ANGLE = 45

module.exports = React.createClass
  displayName: 'PointTool'

  statics:
    defaultValues: ({x, y}) ->
      {x, y}

    initMove: ({x, y}) ->
      {x, y}

  getDeleteButtonPosition: ->
    theta = (DELETE_BUTTON_ANGLE) * (Math.PI / 180)
    x: SELECTED_RADIUS * Math.cos theta
    y: -1 * SELECTED_RADIUS * Math.sin theta

  render: ->
    discStyle = if @props.selected
      r: SELECTED_RADIUS
    else
      r: RADIUS

    <DrawingToolRoot tool={this} transform="translate(#{@props.mark.x}, #{@props.mark.y})">
      <Draggable onStart={@props.select} onDrag={@handleDrag}>
        <circle {...discStyle} />
      </Draggable>
      <DeleteButton tool={this} {...@getDeleteButtonPosition()} />
    </DrawingToolRoot>

  handleDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.classification.emit 'change'
