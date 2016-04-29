React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
getSubjectLocation = require '../lib/get-subject-location'
VideoPlayer = require './video-player'

SUBJECT_STYLE = display: 'block'
NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'FrameViewer'

  getDefaultProps: ->
    subject: null
    frame: 0
    onLoad: NOOP
    classification: null
    workflow: null
    frameWrapper: null
    onChange: ->

  getInitialState: ->
    loading: true
    frameDimensions: {}
    viewBoxDimensions: {
      x: 0,
      y: 0,
      width: 0
      height: 0
    }
    panEnabled: false
    zooming: false
    zoomingTimeoutId: null

  componentDidMount: ->
    if @props.project? && 'pan and zoom' in @props.project?.experimental_tools
      # these events enable a user to navigate an image using arrows, +, and - keys, 
      # while the user is in pan and zoom mode.
      addEventListener "keydown", @frameKeyPan
      addEventListener "mousewheel", @frameKeyPan

  componentWillUnmount: ->
    if @props.project? && 'pan and zoom' in @props.project?.experimental_tools
      removeEventListener "keydown", @frameKeyPan
      removeEventListener "mousewheel", @frameKeyPan

  render: () ->
    subject = @props.subject
    frame = @props.frame
    {type, format, src} = getSubjectLocation @props.subject, @props.frame
    FrameWrapper = @props.frameWrapper
    frameDisplay = switch type
      when 'image'
        <div className="subject-image-frame" >
          <img ref="subjectImage" className={"subject pan-active"} src={src} style={SUBJECT_STYLE} onLoad={@handleLoad} tabIndex={0} onFocus={@togglePanOn} onBlur={@togglePanOff}/>

          {if @state.loading
            <div className="loading-cover" style={@constructor.overlayStyle} >
              <LoadingIndicator />
            </div>}
        </div>
      when 'video'
        <VideoPlayer src={src} type={type} format={format} frame={@props.frame} onLoad={@handleLoad}>
        {if @state.loading
          <div className="loading-cover" style={@constructor.overlayStyle}>
            <LoadingIndicator />
          </div>}
        </VideoPlayer>

    if FrameWrapper
      <div>
        <FrameWrapper frame={frame} naturalWidth={@state.frameDimensions?.width or 0} naturalHeight={@state.frameDimensions?.height or 0} panByDrag={@panByDrag} viewBoxDimensions={@state.viewBoxDimensions or "0 0 0 0"} workflow={@props.workflow} subject={@props.subject} classification={@props.classification} annotation={@props.annotation} loading={@state.loading} onChange={@props.onChange} panEnabled={@state.panEnabled} >
          {frameDisplay}
        </FrameWrapper>
        {if ( @props.project? && 'pan and zoom' in @props.project?.experimental_tools)
          <div className="pan-zoom-controls" >
            <div className="draw-pan-toggle" >
              <div className={if @state.panEnabled then "" else "active"} >
                <button title={"draw"} className={"fa fa-mouse-pointer"} title={"annotate"} onClick={@togglePanOff}/>
              </div>
              <div className={if @state.panEnabled then "active" else ""}>
                <button title={"pan"} className={"fa fa-arrows"} title={"pan"} onClick={@togglePanOn}/>
              </div>
            </div>
            <div>
              <button 
                title={ "zoom out" } 
                className={"zoom-out fa fa-minus" + if @cannotZoomOut() then " disabled" else "" } 
                onMouseDown={ @continuousZoom.bind(this, 1.1 ) } 
                onMouseUp={@stopZoom} 
                onKeyDown={@keyDownZoomButton.bind(this,1.1)} 
                onKeyUp={@stopZoom}
              />
            </div>
            <div>
              <button 
                title={ "zoom in" } 
                className={ "zoom-in fa fa-plus" } 
                onMouseDown={@continuousZoom.bind(this, .9)} 
                onMouseUp={@stopZoom} 
                onKeyDown={@keyDownZoomButton.bind(this,.9)}
                onKeyUp={@stopZoom} 
              />
            </div>
            <div>
              <button title={"reset zoom levels"} className={"reset fa fa-refresh" + if @cannotZoomOut() then " disabled" else ""} onClick={ this.zoomReset } ></button>
            </div>
          </div>}
        
      </div>


    else
      frameDisplay

  handleLoad: (e) ->
    width = e.target.videoWidth ? e.target.naturalWidth
    height = e.target.videoHeight ? e.target.naturalHeight
    @setState
      loading: false
      frameDimensions:
        width: width ? 0
        height: height ? 0

      viewBoxDimensions:
        width: width ? 0
        height: height ? 0
        x: 0
        y: 0

    @props.onLoad? e, @props.frame

  cannotZoomOut: ->
    return @state.frameDimensions.width == @state.viewBoxDimensions.width && @state.frameDimensions.height == @state.viewBoxDimensions.height      

  continuousZoom: (change) ->
    @clearZoomingTimeout()
    return if change == 0
    @setState zooming: true, =>
      zoomNow = =>
        # if !@state.zooming, we don't want to continuously call setTimeout.
        # !@state.zooming will be the case after a user creates a mouseup event.
        return if !@state.zooming
        @zoom(change)
        @clearZoomingTimeout()
        @setState zoomingTimeoutId: setTimeout(zoomNow, 200)
      
      zoomNow()

  clearZoomingTimeout: ->
    if @state.zoomingTimeoutId 
      clearTimeout @state.zoomingTimeoutId

  zoom: (change) ->
    @clearZoomingTimeout()
    return if !@state.zooming
    newNaturalWidth = @state.viewBoxDimensions.width * change
    newNaturalHeight = @state.viewBoxDimensions.height * change
  
    newNaturalX = @state.viewBoxDimensions.x - (newNaturalWidth - @state.viewBoxDimensions.width) / 2
    newNaturalY = @state.viewBoxDimensions.y - (newNaturalHeight - @state.viewBoxDimensions.height) / 2

    if (newNaturalWidth > @state.frameDimensions.width) || (newNaturalHeight * change > @state.frameDimensions.height)
      @zoomReset()

    else
      @setState
        viewBoxDimensions:
          width: newNaturalWidth,
          height: newNaturalHeight,
          x: newNaturalX,
          y: newNaturalY
  
  keyDownZoomButton: (change, e) ->
    # only zoom if a user presses enter on the zoom button.
    if e.which == 13
      @setState zooming: true, =>
        @zoom(change)

  stopZoom: (e) ->
    e.stopPropagation()
    @setState zooming: false
    @continuousZoom(0)

  zoomReset: ->
    @setState
      viewBoxDimensions:
        width: @state.frameDimensions.width, 
        height: @state.frameDimensions.height,
        x: 0,
        y: 0

  togglePanOn: ->
    unless @state.panEnabled
      @setState panEnabled: true, =>
        this.refs.subjectImage.focus()
  
  togglePanOff: ->
    @setState panEnabled: false
  
  toggleKeyPanZoom: ->
    @setState keyPanZoomEnabled: !@state.keyPanZoomEnabled, =>
      if @state.panEnabled then this.refs.subjectImage.focus()

  panByDrag: (e, d) ->
    return unless @state.panEnabled

    maximumX = (@state.frameDimensions.width - @state.viewBoxDimensions.width) + 20
    minumumX = -20
    changedX = @state.viewBoxDimensions.x -= d.x

    maximumY = (@state.frameDimensions.height - @state.viewBoxDimensions.height) + 20
    minimumY = -20
    changedY = @state.viewBoxDimensions.y -= d.y

    @setState
      viewBoxDimensions:
        x: Math.max(minumumX, Math.min(changedX, maximumX))
        y: Math.max(minimumY, Math.min(changedY, maximumY))
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height

  frameKeyPan: (e) ->
    return unless @state.panEnabled
    keypress = e.which
    switch keypress
      # left
      when 37
        e.preventDefault()
        @panHorizontal(-20)
      # up
      when 38 
        e.preventDefault()
        @panVertical(-20) 
      # right
      when 39 
        e.preventDefault()
        @panHorizontal(20) 
      # down
      when 40 
        e.preventDefault()
        @panVertical(20) 
      # zoom out
      when 187
        e.preventDefault()
        @setState zooming: true
        @zoom(.9) 
      # zoom in 
      when 189
        e.preventDefault()
        @setState zooming: true
        @zoom(1.1) 
      # zooming by mousewheel
      when 1
        e.preventDefault()
        if e.deltaY > 0 then @zoom(.9) else @zoom(1.1)

  panHorizontal:(direction) ->
    maximumX = (@state.frameDimensions.width - @state.viewBoxDimensions.width) + 20
    minumumX = -20
    changedX = @state.viewBoxDimensions.x + direction
    @setState
      viewBoxDimensions:
        x: Math.max(minumumX, Math.min(changedX, maximumX))
        y: @state.viewBoxDimensions.y
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height

  panVertical:(direction)->
    maximumY = (@state.frameDimensions.height - @state.viewBoxDimensions.height) + 20
    minimumY = -20
    changedY = @state.viewBoxDimensions.y + direction
    @setState
      viewBoxDimensions:
        x: @state.viewBoxDimensions.x 
        y: Math.max(minimumY, Math.min(changedY, maximumY))
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height
