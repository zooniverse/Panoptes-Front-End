React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require './root'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
isInBounds = require '../../lib/is-in-bounds'
DeleteButton = require './delete-button'

DELETE_BUTTON_ANGLE = 45
SELECTED_RADIUS =
  large: 20
  small: 10

module.exports = createReactClass
  displayName: 'PointGridTool'

  statics:
    defaultValues: ({x, y}) ->
      {x, y}

    initStart: ({x, y}) ->
      {x, y}

    initValid: (mark, {naturalHeight, naturalWidth}) ->
      notBeyondWidth = mark.x < naturalWidth
      notBeyondHeight = mark.y < naturalHeight
      notBeyondWidth and notBeyondHeight

    options: ['grid']

  getDefaultProps: ->
    rows: 10
    cols: 10
    offset_x: 50
    offset_y: 50

  getDeleteButtonPosition: ->
    theta = (DELETE_BUTTON_ANGLE) * (Math.PI / 180)
    x: (SELECTED_RADIUS.large / @props.scale.horizontal) * Math.cos theta
    y: -1 * (SELECTED_RADIUS.large / @props.scale.vertical) * Math.sin theta

  render: ->
    console.log(@props)

    offset_x = @props.offset_x
    offset_y = @props.offset_y

    width = (@props.containerRect.width / @props.scale.horizontal-offset_x) / @props.rows 
    height = (@props.containerRect.height / @props.scale.vertical - offset_y) / @props.cols

    x = (@props.mark.x-offset_x)
    y = (@props.mark.y-offset_y)

    console.log(width, height, x, y, offset_x, offset_y)

    x = (Math.floor(x/width))
    y = Math.floor(y/height)
    console.log(x, y)

    x = x*width+offset_x
    y = y*height+offset_y
    console.log(x, y)
    console.log(@props)

    #x = x+width/2
    #y = y+height/2
    
    <DrawingToolRoot tool={this} transform="translate(#{x}, #{y})" onClick={@destroyTool}>
      <rect x="0" y="0" width="#{width}" height="#{height}"
        fill="gray" fillOpacity="0.5" strokeOpacity="0"/>

      {if @props.selected
        <DeleteButton tool={this} {...@getDeleteButtonPosition()}  getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />}
    </DrawingToolRoot>

  destroyTool: ->
    @setState destroying: true, =>
      setTimeout @props.onDestroy, 300
