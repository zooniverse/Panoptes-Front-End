React = require 'react'
LoadingIndicator = require './loading-indicator'

BASE_64_PNG_HEAD = 'data:image/png;base64,'
BASE_64_JPEG_HEAD = 'data:image/jpeg;base64,'
BASE_64_EXPANSION = 3 / 4

module.exports = React.createClass
  displayName: 'ImageSelector'

  getDefaultProps: ->
    accept: 'image/*'
    maxSize: Infinity # In bytes
    ratio: NaN # Width / height
    quality: 0.8 # For JPEGs
    minArea: 100 # Stop reducing when there are fewer than this many pixels.
    reductionPerPass: 0.05
    onChange: Function.prototype # No-op

  getInitialState: ->
    working: false
    format: ''
    size: NaN

  componentDidMount: ->
    canvas = @refs.preview.getDOMNode()
    canvas.height = canvas.width * @props.ratio

  render: ->
    <span className="image-uploader" style={
      display: 'inline-block'
      minHeight: '1em'
      background: 'rgba(128, 128, 128, 0.2)'
      border: '1px solid rgba(128, 128, 128, 0.4)'
      borderRadius: 5
      position: 'relative'
    }>
      <canvas ref="preview" style={
        display: 'block'
        maxWidth: '100%'
      } />

      <input type="file" accept={@props.accept} disabled={@state.working} style={
        cursor: 'pointer'
        height: '100%'
        left: 0
        position: 'absolute'
        opacity: 0
        top: 0
        width: '100%'
      } onChange={@handleChange} />

      {if @state.working
        <span style={
          fontSize: '2em'
          left: '50%'
          position: 'absolute'
          top: '50%'
          transform: 'translate(-50%, -50%)'
        }>
          <LoadingIndicator />
        </span>}
    </span>

  handleChange: (e) ->
    @setState
      working: true
      format: ''
      size: NaN

    reader = new FileReader
    reader.onload = (e) =>
      img = new Image
      img.onload = =>
        @cropImage img
      img.src = e.target.result
    reader.readAsDataURL e.target.files[0]

  cropImage: (srcImg) ->
    canvas = @refs.preview.getDOMNode()
    canvas.width = srcImg.naturalWidth
    canvas.height = srcImg.naturalHeight

    unless isNaN @props.ratio
      naturalRatio = srcImg.naturalWidth / srcImg.naturalHeight
      if naturalRatio - @props.ratio < 0
        canvas.height = canvas.width / @props.ratio
      else
        canvas.width = canvas.height * @props.ratio

    ctx = canvas.getContext '2d'
    ctx.drawImage srcImg, (srcImg.naturalWidth - canvas.width) / -2, (srcImg.naturalHeight - canvas.height) / -2

    croppedImg = new Image
    croppedImg.onload = =>
      @reduceImage croppedImg
    croppedImg.src = canvas.toDataURL()

  reduceImage: (img, scale = 1) ->
    canvas = @refs.preview.getDOMNode()
    canvas.width = img.naturalWidth * scale
    canvas.height = img.naturalHeight * scale

    ctx = canvas.getContext '2d'
    ctx.drawImage img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height

    pngURL = canvas.toDataURL 'image/png'
    pngSize = Math.round (pngURL.length - BASE_64_PNG_HEAD.length) * BASE_64_EXPANSION

    jpegURL = canvas.toDataURL 'image/jpeg', @props.quality
    jpegSize = Math.round (jpegURL.length - BASE_64_JPEG_HEAD.length) * BASE_64_EXPANSION

    # NOTE: In Chrome at least, PNG is always pretty huge.
    # I think it might not be doing any compression or something.

    [url, format, size] = if pngSize < jpegSize
      [pngURL, 'image/png', pngSize]
    else
      [jpegURL, 'image/jpeg', jpegSize]

    if size > @props.maxSize and canvas.width * canvas.height > @props.minArea
      # Keep trying until it's small enough.
      @reduceImage img, scale - @props.reductionPerPass
    else
      working = false
      @setState {format, size, working}
      @props.onChange url, format
