React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
Draggable = require('../../lib/draggable').default
DeleteButton = require './delete-button'
isInBounds = require '../../lib/is-in-bounds'

RADIUS =
  large: 10
  small: 2
SELECTED_RADIUS =
  large: 20
  small: 10
CROSSHAIR_SPACE = 0.2
CROSSHAIR_WIDTH = 1
DELETE_BUTTON_ANGLE = 45

module.exports = createReactClass
  displayName: 'PointTool'

  statics:
    defaultValues: ({x, y}) ->
      {x, y}

    initStart: ->
      _inProgress: true

    initMove: ({x, y}) ->
      {x, y}

    initValid: (mark, {naturalHeight, naturalWidth}) ->
      notBeyondWidth = mark.x < naturalWidth
      notBeyondHeight = mark.y < naturalHeight
      notBeyondWidth and notBeyondHeight

    initRelease: ->
      _inProgress: false

    options: ['size']

  getDefaultProps: ->
    size: 'large'

  getDeleteButtonPosition: ->
    theta = (DELETE_BUTTON_ANGLE) * (Math.PI / 180)
    x: (SELECTED_RADIUS.large / @props.scale.horizontal) * Math.cos theta
    y: -1 * (SELECTED_RADIUS.large / @props.scale.vertical) * Math.sin theta

  render: ->
    size = @props.size
    averageScale = (@props.scale.horizontal + @props.scale.vertical) / 2

    crosshairSpace = CROSSHAIR_SPACE / averageScale
    crosshairWidth = CROSSHAIR_WIDTH / averageScale
    selectedRadius = SELECTED_RADIUS[size] / averageScale

    radius = if @props.selected
      SELECTED_RADIUS[size] / averageScale
    else
      RADIUS[size] / averageScale

    <DrawingToolRoot tool={this} transform="translate(#{@props.mark.x}, #{@props.mark.y})">
      <line x1="0" y1={-1 * crosshairSpace * selectedRadius} x2="0" y2={-1 * selectedRadius} strokeWidth={crosshairWidth} />
      <line x1={-1 * crosshairSpace * selectedRadius} y1="0" x2={-1 * selectedRadius} y2="0" strokeWidth={crosshairWidth} />
      <line x1="0" y1={crosshairSpace * selectedRadius} x2="0" y2={selectedRadius} strokeWidth={crosshairWidth} />
      <line x1={crosshairSpace * selectedRadius} y1="0" x2={selectedRadius} y2="0" strokeWidth={crosshairWidth} />

      <Draggable onDrag={@handleDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <circle r={radius} />
      </Draggable>

      {if @props.selected
        <DeleteButton tool={this} {...@getDeleteButtonPosition()}  getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />}
    </DrawingToolRoot>

  handleDrag: (e, d) ->
    difference = @props.normalizeDifference(e,d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
    @props.onChange @props.mark
