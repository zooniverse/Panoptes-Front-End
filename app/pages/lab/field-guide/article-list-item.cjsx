React = require 'react'
ReactDOM = require 'react-dom'

CroppedImage = React.createClass
  XLINK_NS: 'http://www.w3.org/1999/xlink'

  getDefaultProps: ->
    src: ''
    width: null
    height: null
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

    <svg viewBox="#{x} #{y} #{width} #{height}" width={@props.width} height={@props.height} {...@props}>
      <image ref="image" x="0" y="0" />
    </svg>

  componentDidUpdate: ->
    image = ReactDOM.findDOMNode @refs.image
    image.setAttribute 'width', @state.naturalWidth
    image.setAttribute 'height', @state.naturalHeight
    image.setAttributeNS @XLINK_NS, 'href', @props.src

ArticleListItem = React.createClass
  getDefaultProps: ->
    icon: null
    title: ''
    onClick: ->

  render: ->
    <button type="button" onClick={@props.onClick}>
      {if @props.icon
        <CroppedImage src={@props.icon} aspectRatio={1} width="3em" height="3em" style={borderRadius: '50%', verticalAlign: 'middle'} />}
      {@props.title}
    </button>

module.exports = ArticleListItem
