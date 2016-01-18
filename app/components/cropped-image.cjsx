React = require 'react'

module.exports = React.createClass
  XLINK_NS: 'http://www.w3.org/1999/xlink'

  getDefaultProps: ->
    src: ''
    aspectRatio: NaN

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0

  componentDidMount: ->
    @loadImage @props.src

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.src is @props.src
      @loadImage nextProps.src

  loadImage: (src) ->
    img = new Image
    img.onload = =>
      {naturalWidth, naturalHeight} = img
      @setState {naturalWidth, naturalHeight}
    img.src = src

  render: ->
    min = Math.min @state.naturalWidth, @state.naturalHeight

    width = min
    height = min

    if @props.aspectRatio < 1
      width = @props.aspectRatio * height
    else if @props.aspectRatio > 1
      height = @props.aspectRatio * width

    x = (@state.naturalWidth - width) / 2
    y = (@state.naturalHeight - height) / 2

    <svg viewBox="#{x} #{y} #{width} #{height}" {...@props}>
      <image ref="image" x="0" y="0" />
    </svg>

  componentDidUpdate: ->
    image = React.findDOMNode @refs.image
    image.setAttribute 'width', @state.naturalWidth
    image.setAttribute 'height', @state.naturalHeight
    image.setAttributeNS @XLINK_NS, 'href', @props.src
