React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
FavoritesButton = require '../collections/favorites-button'
alert = require '../lib/alert'
{Markdown} = require 'markdownz'
getSubjectLocation = require '../lib/get-subject-location'
CollectionsManagerIcon = require '../collections/manager-icon'

NOOP = Function.prototype

subjectHasMixedLocationTypes = (subject) ->
  allTypes = []
  (subject?.locations ? []).forEach (location) ->
    Object.keys(location).forEach (typeAndFormat) ->
      type = typeAndFormat.split('/')[0]
      unless type in allTypes
        allTypes.push type
  allTypes.length > 1

ROOT_STYLE = display: 'block'
CONTAINER_STYLE = display: 'inline-block', position: 'relative'
SUBJECT_STYLE = display: 'block'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  statics:
    overlayStyle:
      height: '100%'
      left: 0
      position: 'absolute'
      top: 0
      width: '100%'

  getDefaultProps: ->
    subject: null
    user: null
    playFrameDuration: 667
    playIterations: 3
    onFrameChange: NOOP
    onLoad: NOOP
    defaultStyle: true
    project: null
    linkToFullImage: false

  getInitialState: ->
    loading: true
    playing: false
    frame: @props.frame ? 0
    time: 0
    playbackRate: 1
  
  componentDidUpdate: ->
    @refs.videoPlayer?.playbackRate = @state.playbackRate

  render: ->
    {type, format, src} = getSubjectLocation @props.subject, @state.frame

    mainDisplay = switch type
      when 'image'
        <img className="subject" src={src} style={SUBJECT_STYLE} onLoad={@handleLoad} />
      when 'video'
        <video ref="videoPlayer" src={src} type={"#{type}/#{format}"} onCanPlayThrough={@handleLoad} onEnded={@endVideo} onTimeUpdate={@updateScrubber}>
          Your browser does not support the video format. Please upgrade your browser.
        </video>

    tools = switch type
      when 'image'
        if @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
          null
        else
          <span className="subject-frame-play-controls">
            {if @state.playing
              <button type="button" className="secret-button" aria-label="Pause" onClick={@setPlaying.bind this, false}>
                <i className="fa fa-pause fa-fw"></i>
              </button>
            else
              <button type="button" className="secret-button" aria-label="Play" onClick={@setPlaying.bind this, true}>
                <i className="fa fa-play fa-fw"></i>
              </button>}
          </span>
      when 'video'
        <span>
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
          <progress ref="videoScrubber" value="0" min="0" value={@state.time} style={width: '80%'} onClick={@seekVideo}>
          </progress>
          <span className="video-speed">
          Speed:
            {for rate, i in [0.25, 0.5, 1]
              <label key="rate-#{i}" className="secret-button">
                <input type="radio" name="playbackRate" value={rate} checked={rate == @state.playbackRate} onChange={@setPlayRate} />
                <span>
                  {rate}&times;
                </span>
              </label>
            }
          </span>
        </span>

    <div className="subject-viewer" style={ROOT_STYLE if @props.defaultStyle}>
      {if type is 'image'
        @hiddenPreloadedImages()}
      <div className="subject-container" style={CONTAINER_STYLE}>
        {mainDisplay}
        {@props.children}
        {if @state.loading
          <div className="loading-cover" style={@constructor.overlayStyle}>
            <LoadingIndicator />
          </div>}
      </div>

      <div className="subject-tools">
        <span style={width: '80%'}>{tools}</span>
        {if @props.subject?.locations.length >= 2
          <span>
            <span className="subject-frame-pips">
              {for i in [0...@props.subject?.locations.length ? 0]
                <button type="button" key={i} className="subject-frame-pip #{if i is @state.frame then 'active' else ''}" value={i} onClick={@handleFrameChange.bind this, i}>{i + 1}</button>}
            </span>
        </span>}
        <span>
          {if @props.subject?.metadata?
            <button type="button" title="Metadata" className="metadata-toggle" onClick={@showMetadata}><i className="fa fa-info-circle fa-fw"></i></button>}
          {if @props.subject? and @props.user? and @props.project?
            <span>
              <FavoritesButton project={@props.project} subject={@props.subject} user={@props.user} />
              <CollectionsManagerIcon project={@props.project} subject={@props.subject} user={@props.user} />
            </span>}
          {if type is 'image' and @props.linkToFullImage
            <a href={src} title="Subject Image" target="_blank">
              <button type="button"><i className="fa fa-photo" /></button>
            </a>}
        </span>
      </div>
    </div>

  hiddenPreloadedImages: ->
    # Render this to ensure that all a subject's location images are cached and ready to display.
    <div style={
      bottom: 0
      height: 1
      opacity: 0.1
      overflow: 'hidden'
      position: 'fixed'
      right: 0
      width: 1
    }>
      {for i in [0...@props.subject.locations.length]
        {src} = getSubjectLocation @props.subject, i
        <img key={i} src={src} />}
    </div>

  setPlaying: (playing) ->
    @setState {playing}
    if playing
      @nextFrame()
      @_playingInterval = setInterval @nextFrame, @props.playFrameDuration

      autoStopDelay = @props.subject.locations.length * @props.playFrameDuration * @props.playIterations
      @_autoStop = setTimeout @setPlaying.bind(this, false), autoStopDelay
    else
      clearInterval @_playingInterval
      clearTimeout @_autoStop

  nextFrame: ->
    @handleFrameChange (@state.frame + 1) %% @props.subject.locations.length

  handleFrameChange: (frame) ->
    @setState {frame}
    @props.onFrameChange frame

  showMetadata: ->
    # TODO: Sticky popup.
    alert <div className="content-container">
      <header className="form-label" style={textAlign: 'center'}>Subject metadata</header>
      <hr />
      <table className="standard-table">
        <tbody>
          {for key, value of @props.subject?.metadata when key.charAt(0) isnt '#' and key[...2] isnt '//'
            <tr key={key}>
              <th>{key}</th>
              <Markdown tag="td" content={value} inline />
            </tr>}
        </tbody>
      </table>
    </div>

  playVideo: (playing) ->
    player = @refs.videoPlayer
    return unless player?
    @setState {playing}
    if playing
      player.play()
    else
      player.pause()
  
  setPlayRate: (e) ->
    playbackRate = parseFloat e.currentTarget.value
    @setState {playbackRate}
  
  seekVideo: (e) ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    pos = (e.pageX  - (scrubber.offsetLeft + scrubber.offsetParent.offsetLeft)) / scrubber.offsetWidth
    time = pos * player.duration
    player.currentTime = time
  
  endVideo: (e) ->
    playing = false
    @setState {playing}
  
  updateScrubber: (e) ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    scrubber.setAttribute 'max', player.duration unless scrubber.getAttribute 'max'
    scrubber.value = player.currentTime

  handleLoad: (e) ->
    @setState loading: false
    @props.onLoad? arguments...
