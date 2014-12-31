mergeInto = require 'lodash.merge'
Model = require '../../lib/model'
React = require 'react'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

DEFAULT_RADIUS = 10
DEFAULT_SQUASH = 1 / 2
DEFAULT_ANGLE = 0

STROKE_WIDTH = 2
CLOSE_BUTTON_ANGLE = 45

module.exports = React.createClass
  displayName: 'EllipseTool'

  getInitialState: ->
    destroying: false

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

    positionAndRotate = "
      translate(#{@props.mark.x}, #{@props.mark.y})
      rotate(#{-1 * @props.mark.angle})
    "

    scaleAndDerotateControls = "
      scale(#{1 / @props.scale.horizontal}, #{1 / @props.scale.vertical})
      rotate(#{@props.mark.angle})
    "

    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2

    deletePosition = @getDeletePosition()

    <g className="ellipse drawing-tool" transform={positionAndRotate} data-disabled={@props.disabled || null} data-selected={@props.selected || null} data-destroying={@state.destroying || null}>
      <g className="drawing-tool-main">
        <Draggable onStart={@handleDragStart} onDrag={@handleMainDrag}>
          <ellipse rx={@props.mark.rx} ry={@props.mark.ry} fill="transparent" stroke={color} strokeWidth={STROKE_WIDTH / averageScale} />
        </Draggable>

        <DeleteButton
          x={deletePosition.x}
          y={deletePosition.y}
          scale={@props.scale}
          rotate={@props.mark.angle}
          onClick={@deleteMark}
        />

        <DragHandle
          onStart={@handleDragStart}
          onDrag={@handleXHandleDrag}
          color={@props.mark._tool.color}
          x={@props.mark.rx}
          y={0}
          scale={@props.scale}
          rotate={@props.mark.angle}
          disabled={@props.disabled}
          selected={@props.selected}
        />

        <DragHandle
          onStart={@handleDragStart}
          onDrag={@handleYHandleDrag}
          color={@props.mark._tool.color}
          x={0}
          y={-1 * @props.mark.ry}
          scale={@props.scale}
          rotate={@props.mark.angle}
          disabled={@props.disabled}
          selected={@props.selected}
        />
      </g>
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
    @props.mark.x = x
    @props.mark.y = y
    @props.classification.emit 'change'

  handleXHandleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    rx = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    @props.mark.rx = rx
    @props.mark.angle = angle
    @props.classification.emit 'change'

  handleYHandleDrag: (e) ->
    {x, y} = @props.getEventOffset e
    ry = @constructor.getDistance @props.mark.x, @props.mark.y , x, y
    angle = @constructor.getAngle @props.mark.x, @props.mark.y , x, y
    angle -= 90
    @props.mark.ry = ry
    @props.mark.angle = angle
    @props.classification.emit 'change'

  deleteMark: ->
    @setState destroying: true
    setTimeout (=>
      markIndex = @props.annotation.marks.indexOf @props.mark
      @props.annotation.marks.splice markIndex, 1
      @props.classification.emit 'change'), 500

  getDeletePosition: ->
    theta = (CLOSE_BUTTON_ANGLE - @props.mark.angle) * (Math.PI / 180)
    x: @props.mark.rx * Math.cos theta
    y: -1 * @props.mark.ry * Math.sin theta
