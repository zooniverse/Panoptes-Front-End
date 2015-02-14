React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

RADIUS = 10
SELECTED_RADIUS = 20
CROSSHAIR_SPACE = 0.2
CROSSHAIR_WIDTH = 1
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
    y: -SELECTED_RADIUS * Math.sin theta

  render: ->
    radius = if @props.selected
      SELECTED_RADIUS
    else
      RADIUS

    <DrawingToolRoot tool={this} transform="translate(#{@props.mark.x}, #{@props.mark.y})">
      <line x1="0" y1={-CROSSHAIR_SPACE * SELECTED_RADIUS} x2="0" y2={-SELECTED_RADIUS} strokeWidth={CROSSHAIR_WIDTH} />
      <line x1={-CROSSHAIR_SPACE * SELECTED_RADIUS} y1="0" x2={-SELECTED_RADIUS} y2="0" strokeWidth={CROSSHAIR_WIDTH} />
      <line x1="0" y1={CROSSHAIR_SPACE * SELECTED_RADIUS} x2="0" y2={SELECTED_RADIUS} strokeWidth={CROSSHAIR_WIDTH} />
      <line x1={CROSSHAIR_SPACE * SELECTED_RADIUS} y1="0" x2={SELECTED_RADIUS} y2="0" strokeWidth={CROSSHAIR_WIDTH} />

      <Draggable onDrag={@handleDrag} disabled={@props.disabled}>
        <circle r={radius} />
      </Draggable>

      {if @props.selected
        <DeleteButton tool={this} {...@getDeleteButtonPosition()} />}
    </DrawingToolRoot>

  handleDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.onChange e
