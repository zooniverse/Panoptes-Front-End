React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
FavoritesButton = require '../collections/favorites-button'
alert = require '../lib/alert'
Markdown = require '../components/markdown'
getSubjectLocation = require '../lib/get-subject-location'
CollectionsManagerIcon = require '../collections/manager-icon'

NOOP = Function.prototype

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
    playFrameDuration: 667
    playIterations: 3
    onFrameChange: NOOP
    onLoad: NOOP
    defaultStyle: true

  getInitialState: ->
    loading: true
    playing: false
    frame: @props.frame ? 0

  render: ->
    {type, format, src} = getSubjectLocation @props.subject, @state.frame

    mainDisplay = switch type
      when 'image'
        <img className="subject" src={src} style={SUBJECT_STYLE} onLoad={@handleImageLoad} />

    tools = switch type
      when 'image'
        if @props.subject?.locations.length < 2
          null
        else
          <span>
            <span className="subject-frame-play-controls">
              {if @state.playing
                <button type="button" className="secret-button" onClick={@setPlaying.bind this, false}>
                  <i className="fa fa-pause fa-fw"></i>
                </button>
              else
                <button type="button" className="secret-button" onClick={@setPlaying.bind this, true}>
                  <i className="fa fa-play fa-fw"></i>
                </button>}
            </span>
            <span className="subject-frame-pips">
              {for i in [0...@props.subject?.locations.length ? 0]
                <button type="button" key={i} className="subject-frame-pip #{if i is @state.frame then 'active' else ''}" value={i} onClick={@handleFrameChange.bind this, i}>{i + 1}</button>}
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
        <span>{tools}</span>
        <span>
          {if @props.subject?.metadata?
            <button type="button" className="metadata-toggle" onClick={@showMetadata}><i className="fa fa-table fa-fw"></i></button>}
          {if @props.subject
            <span>
              <FavoritesButton project={@props.project} subject={@props.subject} />
              <CollectionsManagerIcon project={@props.project} subject={@props.subject} />
            </span>}
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
        {for key, value of @props.subject?.metadata when key.charAt(0) isnt '#' and key[...2] isnt '//'
          <tr key={key}>
            <th>{key}</th>
            <Markdown tag="td" content={value} inline />
          </tr>}
      </table>
    </div>

  handleImageLoad: (e) ->
    @setState loading: false
    @props.onLoad? arguments...
