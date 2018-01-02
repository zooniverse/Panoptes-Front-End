React = require 'react'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
LoadingIndicator = require('./loading-indicator').default
toBlob = require 'data-uri-to-blob' if window.navigator?

BASE_64_EXPANSION = 3 / 4

module.exports = createReactClass
  displayName: 'ImageSelector'

  getDefaultProps: ->
    accept: 'image/*'
    maxSize: Infinity # In bytes
    ratio: NaN # Width / height
    src: ''
    placeholder: ''
    minArea: 300 # Stop reducing when there are fewer than this many pixels.
    reductionPerPass: 0.05
    onChange: Function.prototype # No-op

  getInitialState: ->
    working: false
    rootWidth: NaN

  componentDidMount: ->
    addEventListener 'resize', @updateWidth
    @updateWidth()

  componentWillUnmount: ->
    removeEventListener 'resize', @updateWidth

  render: ->
    <div className="image-selector" style={
      width: @state.rootWidth || 'auto'
      position: 'relative'
    }>
      {if @props.src
        <img className="image-selector-preview" src={@props.src} style={
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
    </div>

  updateWidth: ->
    imageSelectorPreviews = document.getElementsByClassName 'image-selector-preview'

    for img in imageSelectorPreviews
      img.dataset.displayWas = img.style.display
      img.style.display = 'none'

    @setState rootWidth: NaN, =>
      @setState rootWidth: ReactDOM.findDOMNode(@).clientWidth

      for img in imageSelectorPreviews
        img.style.display = img.dataset.displayWas
        delete img.dataset.displayWas

  handleChange: (e) ->
    unless e.target.files.length is 0
      [file] = e.target.files
      @setState working: true

      reader = new FileReader
      reader.onload = (e) =>
        img = new Image
        img.onload = =>
          @cropImage img, file
        img.src = e.target.result
      reader.readAsDataURL file

  cropImage: (srcImg, srcFile) ->
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
    croppedImg.onload = =>
      @reduceImage croppedImg, srcFile
    croppedImg.src = canvas.toDataURL()

  reduceImage: (img, srcFile, _scale = 1) ->
    canvas = document.createElement 'canvas'
    canvas.width = img.naturalWidth * _scale
    canvas.height = img.naturalHeight * _scale

    ctx = canvas.getContext '2d'
    ctx.drawImage img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height

    dataURL = canvas.toDataURL srcFile.type

    try
      size = dataURL.split(';base64,')[1].length * BASE_64_EXPANSION

      if size > @props.maxSize and canvas.width * canvas.height > @props.minArea
        # Keep trying until it's small enough.
        @reduceImage img, srcFile, _scale - @props.reductionPerPass
      else
        @setState working: false

        img.title = srcFile.name
        @props.onChange toBlob(dataURL), img

    catch
      @setState
        working: false

      alert 'Error reducing image. Try a smaller one.'
