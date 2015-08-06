React = require 'react'

module.exports = React.createClass
  displayName: 'SVG'

  getInitialState: ->
    align: 'xMidYMid'
    viewbox: ''

  render: ->
    <svg viewBox={@state.viewbox} preserveAspectRatio="#{@state.align} meet" style={@props.style}>
      {@props.children}
    </svg>
  
  crop: (x = 0, y = 0, width = @props.naturalWidth, height = @props.naturalHeight) ->
    x = Math.max 0, x
    y = Math.max 0, y
    x = Math.min @props.naturalWidth, x
    y = Math.min @props.naturalHeight, y
    maxWidth = @props.naturalWidth - x
    maxHeight = @props.naturalHeight - y
    width = Math.min maxWidth, width
    height = Math.min maxHeight, height
    viewbox = [x,y,width,height].join ' '
    align = @align x, y, width, height
    @setState {viewbox, align}, @props.handleResize
  
  align: (x = 0, y = 0, width = @props.naturalWidth, height = @props.naturalHeight) ->
    aspect = width / height
    subject_aspect = @props.naturalWidth / @props.naturalHeight
    ratio = aspect / subject_aspect
    align = switch
      when ratio < .5 and x < width then 'xMinYMid'
      when ratio < .5 and (x + width) > (@props.naturalWidth - width) then 'xMaxYMid'
      when ratio > 2 and y < height then 'xMidYMin'
      when ratio > 2 and (y + height) > (@props.naturalHeight - height) then 'xMidYMax'
      else 'xMidYMid'
