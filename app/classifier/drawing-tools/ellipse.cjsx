# @cjsx React.DOM

mergeInto = require 'react/lib/mergeInto'
Model = require '../../data/model'
React = require 'react'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'
{dispatch} = require '../../lib/dispatcher'

DEFAULT_RADIUS = 10
DEFAULT_SQUASH = 1 / 2
DEFAULT_ANGLE = 0

CLOSE_BUTTON_ANGLE = 45

module.exports = React.createClass
  displayName: 'EllipseTool'

  statics:
    defaultValues: (mouseCoords) ->
      values =
        rx: DEFAULT_RADIUS
        ry: DEFAULT_RADIUS * DEFAULT_SQUASH
        angle: DEFAULT_ANGLE
      mergeInto values, mouseCoords
      values

    initMove: ({x, y}, mark) ->
      distance = @getDistance mark.x, mark.y, x, y
      angle = @getAngle mark.x, mark.y, x, y
      rx: distance
      ry: distance * DEFAULT_SQUASH
      angle: angle

    getDistance: (x1, y1, x2, y2) ->
      aSquared = Math.pow x2 - x1, 2
      bSquared = Math.pow y2 - y1, 2
      Math.sqrt aSquared + bSquared

    getAngle: (x1, y1, x2, y2) ->
      deltaX = x2 - x1
      deltaY = y2 - y1
      Math.atan2(deltaY, deltaX) * (-180 / Math.PI)

  startOffset: null

  render: ->
    color = @props.mark._tool.color ? 'currentcolor'

    transform = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      rotate(#{-1 * @props.mark.angle})
    "

    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2

    deletePosition = @getDeletePosition()

    <g className="ellipse drawing-tool" transform={transform} data-disabled={@props.disabled || null} data-selected={@props.selected || null}>
      <Draggable onStart={@handleDragStart} onDrag={@handleMainDrag}>
        <ellipse rx={@props.mark.rx * @props.scale.horizontal} ry={@props.mark.ry * @props.scale.vertical} fill="transparent" stroke={color} strokeWidth="2" />
      </Draggable>

      <DeleteButton transform="translate(#{deletePosition.x}, #{deletePosition.y}) rotate(#{@props.mark.angle})" onClick={@deleteMark} />

      <DragHandle onStart={@handleDragStart} onDrag={@handleXHandleDrag} x={@props.mark.rx * @props.scale.horizontal} y={0} rotate={@props.mark.angle} color={@props.mark._tool.color} disabled={@props.disabled} selected={@props.selected} />
      <DragHandle onStart={@handleDragStart} onDrag={@handleYHandleDrag} x={0} y={-1 * @props.mark.ry * @props.scale.vertical} rotate={@props.mark.angle} color={@props.mark._tool.color} disabled={@props.disabled} selected={@props.selected} />
    </g>

  handleDragStart: (e) ->
    @props.select()
    {x, y} = @props.getEventOffset e
    x -= @props.mark.x
    y -= @props.mark.y
    @startOffset = {x, y}

  handleMainDrag: (e) ->
    {x, y} = @props.getEventOffset e
    x -= @startOffset.x
    y -= @startOffset.y
    dispatch 'classification:annotation:mark:update', @props.mark, {x, y}

  handleXHandleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    rx = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    dispatch 'classification:annotation:mark:update', @props.mark, {rx, angle}

  handleYHandleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    ry = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    angle -= 90
    dispatch 'classification:annotation:mark:update', @props.mark, {ry, angle}

  deleteMark: ->
    dispatch 'classification:annotation:mark:delete', @props.mark

  getDeletePosition: ->
    # TODO: It'd be nice if it stayed absolutely 45deg.
    theta = CLOSE_BUTTON_ANGLE * (Math.PI / 180)
    r = (@props.mark.rx * @props.mark.ry) / Math.sqrt(Math.pow(@props.mark.ry * Math.cos(theta), 2) + Math.pow(@props.mark.rx * Math.sin(theta), 2))
    x: @props.scale.horizontal * r * Math.sin theta
    y: @props.scale.vertical * -r * Math.cos theta
