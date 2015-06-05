React = require 'react'
LoadingIndicator = require './loading-indicator'
toBlob = require 'data-uri-to-blob'

BASE_64_PNG_HEAD = 'data:image/png;base64,'
BASE_64_JPEG_HEAD = 'data:image/jpeg;base64,'
BASE_64_EXPANSION = 3 / 4

module.exports = React.createClass
  displayName: 'ImageSelector'

  getDefaultProps: ->
    accept: 'image/*'
    maxSize: Infinity # In bytes
    ratio: NaN # Width / height
    placeholder: ''
    quality: 0.8 # For JPEGs
    minArea: 100 # Stop reducing when there are fewer than this many pixels.
    reductionPerPass: 0.05
    onChange: Function.prototype # No-op

  getInitialState: ->
    working: false
    dataURL: ''
    format: ''
    size: NaN

  render: ->
    <span className="image-selector" style={
      display: 'inline-block'
      minHeight: '1em'
      background: 'rgba(128, 128, 128, 0.2)'
      border: '1px solid rgba(128, 128, 128, 0.4)'
      borderRadius: 5
      position: 'relative'
    }>
      {if @state.dataURL or @props.defaultValue
        <img ref="preview" src={@state.dataURL || @props.defaultValue} style={
          display: 'block'
          maxWidth: '100%'
        } />
      else
        @props.placeholder}

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
    [file] = e.target.files

    @setState
      working: true
      format: ''
      size: NaN

    reader = new FileReader
    reader.onload = (e) =>
      img = new Image
      img.title = file.name
      img.onload = =>
        @cropImage img
      img.src = e.target.result
    reader.readAsDataURL file

  cropImage: (srcImg) ->
    canvas = document.createElement 'canvas'
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
    croppedImg.title = srcImg.title
    croppedImg.onload = =>
      @reduceImage croppedImg
    croppedImg.src = canvas.toDataURL()

  reduceImage: (img, _scale = 1) ->
    canvas = document.createElement 'canvas'
    canvas.width = img.naturalWidth * _scale
    canvas.height = img.naturalHeight * _scale

    ctx = canvas.getContext '2d'
    ctx.drawImage img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height

    pngURL = canvas.toDataURL 'image/png'
    pngSize = Math.round (pngURL.length - BASE_64_PNG_HEAD.length) * BASE_64_EXPANSION

    jpegURL = canvas.toDataURL 'image/jpeg', @props.quality
    jpegSize = Math.round (jpegURL.length - BASE_64_JPEG_HEAD.length) * BASE_64_EXPANSION

    # NOTE: In Chrome at least, PNG is always pretty huge.
    # I think it might not be doing any compression or something.

    [dataURL, format, size] = if pngSize < jpegSize
      [pngURL, 'image/png', pngSize]
    else
      [jpegURL, 'image/jpeg', jpegSize]

    @setState {dataURL, format, size}

    if size > @props.maxSize and canvas.width * canvas.height > @props.minArea
      # Keep trying until it's small enough.
      @reduceImage img, _scale - @props.reductionPerPass
    else
      @setState working: false
      @props.onChange toBlob(dataURL), img
