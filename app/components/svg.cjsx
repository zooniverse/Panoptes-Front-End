React = require 'react'

module.exports = React.createClass
  displayName: 'SVG'

  getDefaultProps: ->
    viewBox: null

  getInitialState: ->
    align: 'xMidYMid'
    viewBox: ''

  componentDidMount: ->
    @crop()

  render: ->
    <svg viewBox={@props.viewBox} preserveAspectRatio="#{@state.align} meet" style={@props.style}>
      {@props.children}
    </svg>

  crop: (x = 0, y = 0, width = @props.naturalWidth, height = @props.naturalHeight) ->
    return
    x = Math.max 0, x
    y = Math.max 0, y
    x = Math.min @props.naturalWidth, x
    y = Math.min @props.naturalHeight, y
    maxWidth = @props.naturalWidth - x
    maxHeight = @props.naturalHeight - y
    width = Math.min maxWidth, width
    height = Math.min maxHeight, height
    viewBox = [x, y, width, height].join ' '
    align = @align x, y, width, height
    @setState {viewBox, align}, @props.onResize

  align: (x = 0, y = 0, width = @props.naturalWidth, height = @props.naturalHeight) ->
    return
    aspect = width / height
    subjectAspect = @props.naturalWidth / @props.naturalHeight
    ratio = aspect / subjectAspect
    align = switch
      when ratio < 0.5 and x < width then 'xMinYMid'
      when ratio < 0.5 and (x + width) > (@props.naturalWidth - width) then 'xMaxYMid'
      when ratio > 2 and y < height then 'xMidYMin'
      when ratio > 2 and (y + height) > (@props.naturalHeight - height) then 'xMidYMax'
      else 'xMidYMid'
