React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
getSubjectLocation = require '../lib/get-subject-location'

SUBJECT_STYLE = display: 'block'
NOOP = Function.prototype

# Generates a standard ref for a radio button, based on the subject and frame, to avoid conflicts with radios in other viewers on the page
generateRadioRef = (name, subject, frame) =>
  'subject'+subject.id+'_frame'+frame+'_'+name

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
    playing: false
    playbackRate: 1
    frameDimensions: {}
    viewBoxDimensions: {
      x: 0,
      y: 0,
      width: 0
      height: 0
    }
    panEnabled: false
    zooming: false

  componentDidMount: ->
    @refs.videoScrubber?.value = 0
    addEventListener "keypress", @frameKeyPan

  componentDidUpdate: ->
    @refs.videoPlayer?.playbackRate = @state.playbackRate

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
        <div className="subject-video-frame">
          <video ref="videoPlayer" src={src} type={"#{type}/#{format}"} preload="auto" onCanPlay={@handleLoad} onEnded={@endVideo} onTimeUpdate={@updateScrubber}>
            Your browser does not support the video format. Please upgrade your browser.
          </video>
          <span className="subject-video-controls">
            <span className="subject-frame-play-controls">
              {if @state.playing
                <button type="button" className="secret-button" aria-label="Pause" onClick={@playVideo.bind this, false}>
                  <i className="fa fa-pause fa-fw"></i>
                </button>
              else
                <button type="button" className="secret-button" aria-label="Play" onClick={@playVideo.bind this, true}>
                  <i className="fa fa-play fa-fw"></i>
                </button>}
            </span>
            <input type="range" className="video-scrubber" ref="videoScrubber" min="0" step="any" onChange={@seekVideo} />
            <span className="video-speed">
            Speed:
              {for rate, i in [0.25, 0.5, 1]
                ref = generateRadioRef 'rate', subject, frame
                <label key="rate-#{i}" className="secret-button">
                  <input type="radio" name={ref} ref={ref} value={rate} checked={rate == @state.playbackRate} onChange={@setPlayRate} />
                  <span>
                    {rate}&times;
                  </span>
                </label>
              }
            </span>
          </span>

          {if @state.loading
            <div className="loading-cover" style={@constructor.overlayStyle}>
              <LoadingIndicator />
            </div>}
        </div>

    if FrameWrapper
      <div>
        <FrameWrapper frame={frame} naturalWidth={@state.frameDimensions?.width or 0} naturalHeight={@state.frameDimensions?.height or 0} panByDrag={@panByDrag} viewBoxDimensions={@state.viewBoxDimensions or "0 0 0 0"} workflow={@props.workflow} subject={@props.subject} classification={@props.classification} annotation={@props.annotation} loading={@state.loading} onChange={@props.onChange} panEnabled={@state.panEnabled} >
          {frameDisplay}
        </FrameWrapper>
        {if ( @props.project? && 'pan and zoom' in @props.project?.experimental_tools)
          <div className="pan-zoom-controls" >
            <span className="draw-pan-toggle" >
              <span onClick={@togglePan} className={if @state.panEnabled then "" else "active"} >
                <button title={"draw"} className={"fa fa-mouse-pointer"} title={"annotate"} onClick={@togglePanOff}/>
              </span>
              <span className={if @state.panEnabled then "active" else ""}>
                <button title={"pan"} className={"fa fa-arrows"} title={"pan"} onClick={@togglePanOn}/>
              </span>
            </span>
            <span>
              <button title={"zoom out"} className="zoom-out fa fa-minus" onClick={ @zoom.bind(this, 1.1 ) } />
            </span>
            <span>
              <button title={"zoom in"} className="zoom-in fa fa-plus" onMouseDown={@zoom.bind(this, .9)} onMouseUp={@toggleZoom} />
            </span>
            <span>
              <button title={"rest zoom levels"} className="reset fa fa-refresh" onClick={ this.zoomReset } ></button>
            </span>
          </div>}
        
      </div>


    else
      frameDisplay

  setPlaying: ( playing) ->
    if playing
      @nextFrame()
      @_playingInterval = setInterval @nextFrame, @props.playFrameDuration

      autoStopDelay = @props.subject.locations.length * @props.playFrameDuration * @props.playIterations
      @_autoStop = setTimeout @setPlaying.bind(this, false), autoStopDelay
    else
      clearInterval @_playingInterval
      clearTimeout @_autoStop

  playVideo: (playing) ->
    player = @refs.videoPlayer
    return unless player?

    @setState
      playing: playing

    if playing
      player.play()
    else
      player.pause()

  setPlayRate: (e) ->
    @setState
      playbackRate: parseFloat e.target.value

  seekVideo: () ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    time = scrubber.value
    player.currentTime = time

  endVideo: () ->
    @setState
      playing: false

  updateScrubber: () ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    scrubber.setAttribute 'max', player.duration unless scrubber.getAttribute 'max'
    scrubber.value = player.currentTime

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

  zoom: (change) ->
    newNaturalWidth = @state.viewBoxDimensions.width * change
    newNaturalHeight = @state.viewBoxDimensions.height * change
  
    newNaturalX = @state.viewBoxDimensions.x - (newNaturalWidth - @state.viewBoxDimensions.width)/2
    newNaturalY = @state.viewBoxDimensions.y - (newNaturalHeight - @state.viewBoxDimensions.height)/2

    if (newNaturalWidth > @state.frameDimensions.width) || (newNaturalHeight * change > @state.frameDimensions.height)
      @zoomReset()

    else     
      @setState
        viewBoxDimensions:
          width: newNaturalWidth,
          height: newNaturalHeight,
          x: newNaturalX,
          y: newNaturalY
        , =>
          console.log "Pressed Zoom"
          # setTimeout(function(){ debugger; }, 3000);
          # setTimeout console.log "time", 0000
          # debugger
          

  zoomReset: ->
    @setState
      viewBoxDimensions:
        width: @state.frameDimensions.width, 
        height: @state.frameDimensions.height,
        x: 0,
        y: 0


  toggleZoom: ->
    console.log "toggleZoom"
    @setState zooming: !@state.zooming

  togglePanOn: ->
    unless @state.panEnabled == true
      @setState panEnabled: true, =>
        if @state.panEnabled then this.refs.subjectImage.focus()
  
  togglePanOff: ->
    @setState panEnabled: false
  
  toggleKeyPanZoom: ->
    @setState keyPanZoomEnabled: !@state.keyPanZoomEnabled, =>
      if @state.panEnabled then this.refs.subjectImage.focus()

  panByDrag: (e, d) ->
    return if @state.panEnabled == false
    minX = @state.frameDimensions.width - @state.viewBoxDimensions.width
    minY = @state.frameDimensions.height - @state.viewBoxDimensions.height

    @setState
      viewBoxDimensions:
        x: Math.max(0, Math.min(@state.viewBoxDimensions.x -= d.x, minX))
        y: Math.max(0, Math.min(@state.viewBoxDimensions.y -= d.y, minY))
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height

  frameKeyPan: (e)->
    console.log "frameKeyPan()"
    console.log "---> keypress", e.which
    console.log "---> @state.panEnabled", @state.panEnabled
    return if @state.panEnabled == false
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
      when 61 #187 
        e.preventDefault()
        @zoom(.9) 
      # zoom in 
      when 45 #189 
        @setState zooming: true
        e.preventDefault()
        @zoom(1.1) 


  panHorizontal:(direction) ->
    minX = @state.frameDimensions.width - @state.viewBoxDimensions.width
    @setState
      viewBoxDimensions:
        x: Math.max(0, Math.min(@state.viewBoxDimensions.x + direction, minX))
        y: @state.viewBoxDimensions.y
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height

  panVertical:(direction)->
    minY = @state.frameDimensions.height - @state.viewBoxDimensions.height
    @setState
      viewBoxDimensions:
        x: @state.viewBoxDimensions.x 
        y: Math.max(0, Math.min(@state.viewBoxDimensions.y + direction, minY))
        width: @state.viewBoxDimensions.width
        height: @state.viewBoxDimensions.height
