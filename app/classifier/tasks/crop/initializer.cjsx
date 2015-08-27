React = require 'react'
Draggable = require '../../../lib/draggable'
DragHandle = require '../../drawing-tools/drag-handle'

module.exports = React.createClass
  displayName: 'CropInitializer'

  render: ->
    <g>
      <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag}>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.2)" stroke="0"></rect>
      </Draggable>
      {if @props.annotation.value?
        {x, y, width, height} = @props.annotation.value
        <g>
          <g fill="rgba(0, 0, 0, 0.5)" stroke="none" style={pointerEvents: 'none'}>
            <rect x="0" y="0" width={x} height="100%"></rect>
            <rect x={x + width} y="0" width={@props.containerRect.width - (x + width)} height="100%"></rect>
            <rect x={x} y="0" width={width} height={y}></rect>
            <rect x={x} y={y + height} width={width} height={@props.containerRect.height - (y + height)}></rect>
          </g>

          <rect x={x} y="-10" width={width} height="110%" fill="none" stroke="rgba(127, 127, 127, 0.5)" strokeWidth={1 / @props.scale.horizontal}></rect>
          <rect x="-10" y={y} width="110%" height={height} fill="none" stroke="rgba(127, 127, 127, 0.5)" strokeWidth={1 / @props.scale.vertical}></rect>

          <Draggable onDrag={@handleBoxDrag}>
            <rect x={x} y={y} width={width} height={height} fill="rgba(255, 255, 255, 0.001)" stroke="black" strokeWidth={1 / @props.scale.horizontal}></rect>
          </Draggable>

          <g style={color: 'white'}>
            <DragHandle x={x} y={y + (height / 2)} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragNear.bind this, 'x'}  />
            <DragHandle x={x + width} y={y + (height / 2)} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragFar.bind this, 'x'} />
            <DragHandle x={x + (width / 2)} y={y} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragNear.bind this, 'y'} />
            <DragHandle x={x + (width / 2)} y={y + height} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragFar.bind this, 'y'} />
          </g>
        </g>}
    </g>

  handleInitStart: (e) ->
    {x, y} = @props.getEventOffset e
    _start = {x, y}
    @props.annotation.value = {x, y, width: 0, height: 0, _start}
    @props.classification.update 'annotation'

  handleInitDrag: (e) ->
    {x, y} = @props.getEventOffset e
    x = Math.max 0, Math.min x, @props.containerRect.width
    y = Math.max 0, Math.min y, @props.containerRect.height
    {_start} = @props.annotation.value
    @props.annotation.value.x = Math.min _start.x, x
    @props.annotation.value.y = Math.min _start.y, y
    @props.annotation.value.width = Math.abs _start.x - x
    @props.annotation.value.height = Math.abs _start.y - y
    @props.classification.update 'annotation'

  handleBoxDrag: (e, d) ->
    maxX = @props.containerRect.width - @props.annotation.value.width
    maxY = @props.containerRect.height - @props.annotation.value.height
    @props.annotation.value.x = Math.max 0, Math.min maxX, @props.annotation.value.x + d.x
    @props.annotation.value.y = Math.max 0, Math.min maxY, @props.annotation.value.y + d.y
    @props.classification.update 'annotations'

  handleStartHandle: (e) ->
    mouse = @props.getEventOffset e
    {x, y, width, height} = @props.annotation.value
    rect = {x, y, width, height}
    @props.annotation.value._start = {mouse, rect}

  handleDragNear: (coord, e) ->
    dimension = {x: 'width', y: 'height'}[coord]
    mouse = @props.getEventOffset e
    mouse[coord] = Math.max 0, Math.min mouse[coord], @props.containerRect[dimension]
    {_start} = @props.annotation.value
    diff = _start.mouse[coord] - mouse[coord]
    @props.annotation.value[coord] = Math.min _start.mouse[coord] + _start.rect[dimension], mouse[coord]
    @props.annotation.value[dimension] = Math.abs _start.rect[dimension] + diff
    @props.classification.update 'annotation'

  handleDragFar: (coord, e) ->
    dimension = {x: 'width', y: 'height'}[coord]
    mouse = @props.getEventOffset e
    mouse[coord] = Math.max 0, Math.min mouse[coord], @props.containerRect[dimension]
    {_start} = @props.annotation.value
    diff = _start.mouse[coord] - mouse[coord]
    @props.annotation.value[coord] = Math.min _start.rect[coord], mouse[coord]
    @props.annotation.value[dimension] = Math.abs _start.rect[dimension] - diff
    @props.classification.update 'annotation'
