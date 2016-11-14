React = require 'react'

MAX_THUMBNAIL_DIMENSION = 999

module.exports = React.createClass
  displayName: 'Thumbnail'

  getDefaultProps: ->
    src: ''
    width: MAX_THUMBNAIL_DIMENSION
    height: MAX_THUMBNAIL_DIMENSION
    origin: 'https://thumbnails.zooniverse.org'
    format: 'image'

  getInitialState: ->
    failed: false

  getThumbnailSrc: ({origin, width, height, src}) ->
    srcPath = src.split('//').pop()
    "#{origin}/#{width}x#{height}/#{srcPath}"

  render: ->
    src = if @state.failed
      @props.src
    else
      @getThumbnailSrc @props

    dimensions =
      width: null
      height: null

    style =
      maxWidth: @props.width
      maxHeight: @props.height

    if (@props.format == 'mp4')
      <div>
        <video width="300" controls>
          <source src={@props.src} type="video/mp4" />
         </video>
      </div>
    else
      <img {...@props} src={src} {...dimensions} style={style} onError={@handleError} />

  handleError: ->
    unless @state.failed
      @setState failed: true
