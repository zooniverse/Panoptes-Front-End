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

  statics:
    overlayStyle:
      height: '100%'
      left: 0
      position: 'absolute'
      top: 0
      width: '100%'

  getDefaultProps: ->
    subject: null
    frame: 0
    onLoad: NOOP
    classification: null
    workflow: null

  getInitialState: ->
    loading: true
    playing: false
    playbackRate: 1
    frameDimensions: {}
    frameWrapper: null

  componentDidMount: ->
    @refs.videoScrubber?.value = 0

  componentDidUpdate: ->
    @refs.videoPlayer?.playbackRate = @state.playbackRate

  render: () ->
    subject = @props.subject
    frame = @props.frame
    {type, format, src} = getSubjectLocation @props.subject, @props.frame
    FrameWrapper = @props.frameWrapper
    frameDisplay = switch type
      when 'image'
        <div className="subject-image-frame">
          <img className="subject" src={src} style={SUBJECT_STYLE} onLoad={@handleLoad} />

          {if @state.loading
            <div className="loading-cover" style={@constructor.overlayStyle}>
              <LoadingIndicator />
            </div>}
        </div>
      when 'video'
        <div className="subject-video-frame">
          <video ref="videoPlayer" src={src} type={"#{type}/#{format}"} onCanPlayThrough={@handleLoad} onEnded={@endVideo} onTimeUpdate={@updateScrubber}>
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
      <FrameWrapper frame={frame} naturalWidth={@state.frameDimensions?.width or 0} naturalHeight={@state.frameDimensions?.height or 0} workflow={@props.workflow} subject={@props.subject} classification={@props.classification} annotation={@props.annotation} loading={@state.loading}>
        {frameDisplay}
      </FrameWrapper>
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

    @props.onLoad? arguments...
