React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
DeleteButton = require './delete-button'

FINISHER_RADIUS = 8

DELETE_BUTTON_WEIGHT = 5 # Weight of the second point.

module.exports = React.createClass
  displayName: 'PolygonTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      points: []

    initStart: ({x, y}, mark) ->
      mark.points.push {x, y}
      points: mark.points

    initMove: ({x, y}, mark) ->
      mark.points[mark.points.length - 1] = {x, y}
      points: mark.points

    isComplete: (mark) ->
      mark._finished

  render: ->
    firstPoint = @props.mark.points[0]
    secondPoint = @props.mark.points[1]
    secondPoint ?=
      x: firstPoint.x + (FINISHER_RADIUS * 2)
      y: firstPoint.y - (FINISHER_RADIUS * 2)
    lastPoint = @props.mark.points[@props.mark.points.length - 1]

    points = ([x, y].join ',' for {x, y} in @props.mark.points)
    if @props.mark._finished
      points.push [firstPoint.x, firstPoint.y].join ','
    points = points.join '\n'

    deleteButtonPosition =
      x: (firstPoint.x + ((DELETE_BUTTON_WEIGHT - 1) * secondPoint.x)) / DELETE_BUTTON_WEIGHT
      y: (firstPoint.y + ((DELETE_BUTTON_WEIGHT - 1) * secondPoint.y)) / DELETE_BUTTON_WEIGHT

    <DrawingToolRoot tool={this}>
      <Draggable onStart={@props.select} onDrag={@handleMainDrag}>
        <polyline points={points} fill={'none' unless @props.mark._finished} />
      </Draggable>

      <DeleteButton tool={this} x={deleteButtonPosition.x} y={deleteButtonPosition.y} />

      {for {x, y}, i in @props.mark.points
        <DragHandle key={i} x={x} y={y} onDrag={@handleHandleDrag.bind this, i} />}

      {unless @props.mark._finished
        <g>
          {if @props.mark.points.length > 2
            <line className="guideline" x1={lastPoint.x} y1={lastPoint.y} x2={firstPoint.x} y2={firstPoint.y} />}
          <circle className="clickable" r={FINISHER_RADIUS} cx={firstPoint.x} cy={firstPoint.y} onMouseDown={@handleFinishClick} />
        </g>}
    </DrawingToolRoot>

  handleFinishClick: ->
    @props.mark._finished = true
    @props.classification.emit 'change'

  handleMainDrag: (e, d) ->
    for point in @props.mark.points
      point.x += d.x
      point.y += d.y
    @props.classification.emit 'change'

  handleHandleDrag: (index, e, d) ->
    @props.mark.points[index].x += d.x
    @props.mark.points[index].y += d.y
    @props.classification.emit 'change'
