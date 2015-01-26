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
    discStyle = if @props.selected
      r: SELECTED_RADIUS
    else
      r: RADIUS

    <DrawingToolRoot tool={this} transform="translate(#{@props.mark.x}, #{@props.mark.y})">
      <Draggable onDrag={@handleDrag}>
        <circle {...discStyle} />
      </Draggable>
      <line strokeWidth={CROSSHAIR_WIDTH} x1="0" y1={-CROSSHAIR_SPACE * SELECTED_RADIUS} x2="0" y2={-SELECTED_RADIUS} />
      <line strokeWidth={CROSSHAIR_WIDTH} x1={-CROSSHAIR_SPACE * SELECTED_RADIUS} y1="0" x2={-SELECTED_RADIUS} y2="0" />
      <line strokeWidth={CROSSHAIR_WIDTH} x1="0" y1={CROSSHAIR_SPACE * SELECTED_RADIUS} x2="0" y2={SELECTED_RADIUS} />
      <line strokeWidth={CROSSHAIR_WIDTH} x1={CROSSHAIR_SPACE * SELECTED_RADIUS} y1="0" x2={SELECTED_RADIUS} y2="0" />
      <DeleteButton tool={this} {...@getDeleteButtonPosition()} />
    </DrawingToolRoot>

  handleDrag: (e, d) ->
    @props.classification.update annotations: =>
      @props.mark.x += d.x / @props.scale.horizontal
      @props.mark.y += d.y / @props.scale.vertical
      @props.classification.annotations
