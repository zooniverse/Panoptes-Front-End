Model = require '../../lib/model'
React = require 'react'
Draggable = require '../../lib/draggable'
DragHandle = require './drag-handle'
DeleteButton = require './delete-button'
{dispatch} = require '../../lib/dispatcher'

STROKE_WIDTH = 1.5
STROKE_GRABBER_WIDTH = 5

module.exports = React.createClass
  displayName: 'PointTool'

  getInitialState: ->
    destroying: false

  statics:
    defaultValues: ({x, y}) ->
      x1: x, y1: y, x2: x, y2: y

    initStart: ({x, y}) ->
      x1: x, y1: y

    initMove: ({x, y}) ->
      x2: x, y2: y

  render: ->
    color = @props.mark._tool.color ? 'currentcolor'

    toolState =
      'data-disabled': @props.disabled or null
      'data-selected': @props.selected or null
      'data-destroying': @state.destroying or null

    {x1, y1, x2, y2} = @props.mark
    points = {x1, y1, x2, y2}

    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2

    deleteButtonPosition =
      x: (x1 + x2) / 2
      y: (y1 + y2) / 2

    <g className="line drawing-tool" {...toolState}>
      <g className="drawing-tool-main">
        <line {...points} stroke={color} strokeWidth={STROKE_WIDTH / averageScale} />

        <Draggable onDrag={@handleStrokeDrag}>
          <line {...points} stroke={color} strokeOpacity="0.5" strokeWidth={STROKE_GRABBER_WIDTH / averageScale} />
        </Draggable>

        <DeleteButton
          x={deleteButtonPosition.x}
          y={deleteButtonPosition.y}
          onClick={@deleteMark}
        />

        {for n in [1..2]
          <DragHandle
            key={n}
            onDrag={@handleHandleDrag.bind this, n}
            color={@props.mark._tool.color}
            x={@props.mark["x#{n}"]}
            y={@props.mark["y#{n}"]}
            scale={@props.scale}
            rotate={@props.mark.angle}
            disabled={@props.disabled}
            selected={@props.selected}
          />}
      </g>
    </g>

  handleStrokeDrag: (e, d) ->
    for n in [1..2]
      @props.mark["x#{n}"] += d.x
      @props.mark["y#{n}"] += d.y
    @props.classification.emit 'change'

  handleHandleDrag: (n, e, d) ->
    @props.mark["x#{n}"] += d.x
    @props.mark["y#{n}"] += d.y
    @props.classification.emit 'change'

  deleteMark: ->
    @setState destroying: true
    setTimeout (=>
      markIndex = @props.annotation.marks.indexOf @props.mark
      @props.annotation.marks.splice markIndex, 1
      @props.classification.emit 'change'), 500
