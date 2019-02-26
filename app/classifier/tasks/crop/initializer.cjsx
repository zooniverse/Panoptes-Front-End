React = require 'react'
createReactClass = require 'create-react-class'
Draggable = require('../../../lib/draggable').default
DragHandle = require '../../drawing-tools/drag-handle'

module.exports = createReactClass
  displayName: 'CropInitializer'

  render: ->
    <g>
      <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag}>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.001)" style={cursor: 'crosshair'}></rect>
      </Draggable>

      {if @props.annotation.value?
        {x, y, width, height} = @props.annotation.value

        <g>
          <g fill="rgba(0, 0, 0, 0.5)" stroke="none" style={pointerEvents: 'none'}>
            <rect x="0" y="0" width={x} height="100%"></rect>
            <rect x={x + width} y="0" width={(@props.containerRect.width / @props.scale.horizontal) - (x + width)} height="100%"></rect>
            <rect x={x} y="0" width={width} height={y}></rect>
            <rect x={x} y={y + height} width={width} height={(@props.containerRect.height / @props.scale.vertical) - (y + height)}></rect>
          </g>

          <rect x={x} y="-10" width={width} height="110%" fill="none" stroke="rgba(127, 127, 127, 0.5)" strokeWidth={1 / @props.scale.horizontal}></rect>
          <rect x="-10" y={y} width="110%" height={height} fill="none" stroke="rgba(127, 127, 127, 0.5)" strokeWidth={1 / @props.scale.vertical}></rect>

          <Draggable onDrag={@handleBoxDrag}>
            <rect x={x} y={y} width={width} height={height} fill="rgba(255, 255, 255, 0.001)" stroke="black" strokeWidth={1 / @props.scale.horizontal} style={cursor: 'move'}></rect>
          </Draggable>

          <g style={color: 'white'}>
            <DragHandle x={x} y={y + (height / 2)} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragNear.bind this, 'x'} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} style={cursor: 'ew-resize'} />
            <DragHandle x={x + width} y={y + (height / 2)} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragFar.bind this, 'x'} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} style={cursor: 'ew-resize'} />
            <DragHandle x={x + (width / 2)} y={y} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragNear.bind this, 'y'} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} style={cursor: 'ns-resize'} />
            <DragHandle x={x + (width / 2)} y={y + height} scale={@props.scale} onStart={@handleStartHandle} onDrag={@handleDragFar.bind this, 'y'} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} style={cursor: 'ns-resize'} />
          </g>
        </g>}
    </g>

  handleInitStart: (e) ->
    {x, y} = @props.getEventOffset e
    _start = {x, y}
    @props.annotation.value = {x, y, width: 0, height: 0, _start}
    @props.onChange @props.annotation

  handleInitDrag: (e) ->
    {x, y} = @props.getEventOffset e
    x = Math.max 0, Math.min x, (@props.containerRect.width / @props.scale.horizontal)
    y = Math.max 0, Math.min y, (@props.containerRect.height / @props.scale.vertical)
    {_start} = @props.annotation.value
    @props.annotation.value.x = Math.min _start.x, x
    @props.annotation.value.y = Math.min _start.y, y
    @props.annotation.value.width = Math.abs _start.x - x
    @props.annotation.value.height = Math.abs _start.y - y
    @props.onChange @props.annotation

  handleBoxDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    maxX = (@props.containerRect.width / @props.scale.horizontal) - @props.annotation.value.width
    maxY = (@props.containerRect.height / @props.scale.vertical) - @props.annotation.value.height
    @props.annotation.value.x = Math.max 0, Math.min maxX, @props.annotation.value.x += difference.x
    @props.annotation.value.y = Math.max 0, Math.min maxY, @props.annotation.value.y += difference.y
    @props.onChange @props.annotation

  handleStartHandle: (e) ->
    mouse = @props.getEventOffset e
    {x, y, width, height} = @props.annotation.value
    rect = {x, y, width, height}
    @props.annotation.value._start = {mouse, rect}

  handleDragNear: (coord, e) ->
    dimension = {x: 'width', y: 'height'}[coord]
    direction = {x: 'horizontal', y: 'vertical'}[coord]
    mouse = @props.getEventOffset e
    mouse[coord] = Math.max 0, Math.min mouse[coord], @props.containerRect[dimension] / @props.scale[direction]
    {_start} = @props.annotation.value
    diff = _start.mouse[coord] - mouse[coord]
    @props.annotation.value[coord] = Math.min _start.mouse[coord] + _start.rect[dimension], mouse[coord]
    @props.annotation.value[dimension] = Math.abs _start.rect[dimension] + diff
    @props.onChange @props.annotation

  handleDragFar: (coord, e) ->
    dimension = {x: 'width', y: 'height'}[coord]
    direction = {x: 'horizontal', y: 'vertical'}[coord]
    mouse = @props.getEventOffset e
    mouse[coord] = Math.max 0, Math.min mouse[coord], @props.containerRect[dimension] / @props.scale[direction]
    {_start} = @props.annotation.value
    diff = _start.mouse[coord] - mouse[coord]
    @props.annotation.value[coord] = Math.min _start.rect[coord], mouse[coord]
    @props.annotation.value[dimension] = Math.abs _start.rect[dimension] - diff
    @props.onChange @props.annotation
