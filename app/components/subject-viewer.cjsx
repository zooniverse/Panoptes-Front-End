React = require 'react'
FavoritesButton = require '../collections/favorites-button'
alert = require '../lib/alert'
{Markdown} = require 'markdownz'
getSubjectLocation = require '../lib/get-subject-location'
CollectionsManagerIcon = require '../collections/manager-icon'
FrameViewer = require './frame-viewer'
classnames = require 'classnames'

NOOP = Function.prototype

subjectHasMixedLocationTypes = (subject) ->
  allTypes = []
  (subject?.locations ? []).forEach (location) ->
    Object.keys(location).forEach (typeAndFormat) ->
      type = typeAndFormat.split('/')[0]
      unless type in allTypes
        allTypes.push type
  allTypes.length > 1

CONTAINER_STYLE = display: 'flex', flexWrap: 'wrap', position: 'relative'

module.exports = React.createClass
  displayName: 'SubjectViewer'

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
    frameWrapper: null
    allowFlipbook: true
    allowSeparateFrames: false

  getInitialState: ->
    loading: true
    playing: false
    frame: @props.frame ? 0
    frameDimensions: {}
    inFlipbookMode: @props.allowFlipbook

  willReceiveProps: (nextProps) ->
    # The default state for subjects is flipbook if allowed
    if typeof nextProps.allowFlipbook is 'boolean'
      this.setState
        inFlipbookMode: allowFlipbook

  render: ->
    rootClasses = classnames('subject-viewer', {
      'default-root-style': @props.defaultStyle
      'subject-viewer--flipbook': @state.inFlipbookMode
      "subject-viewer--layout-#{@props.workflow?.configuration?.multi_image_layout}": @props.workflow?.configuration?.multi_image_layout
    })
    # Feature detect IE11 and apply flex prop. Revisit or remove when IE11 is no longer supported.
    rootStyle = flex: "1 1 auto" if "ActiveXObject" in window or window.ActiveXObject isnt undefined
    mainDisplay = ''
    {type, format, src} = getSubjectLocation @props.subject, @state.frame
    if @state.inFlipbookMode
      mainDisplay = @renderFrame @state.frame
    else
      mainDisplay = (@renderFrame frame, {key: "frame-#{frame}"} for frame of @props.subject.locations)


    tools = switch type
      when 'image'
        if not @state.inFlipbookMode or @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
          if @props.allowFlipbook and @props.allowSeparateFrames
            <button aria-label="Toggle flipbook mode" title="Toggle flipbook mode" className="flipbook-toggle" onClick={@toggleInFlipbookMode}>
              <i className={"fa fa-fw " + if @state.inFlipbookMode then "fa-th-large" else "fa-film"}></i>
            </button>
        else
          <span className="tools">
            {if @props.allowFlipbook and @props.allowSeparateFrames
              <button aria-label="Toggle flipbook mode" title="Toggle flipbook mode" className="flipbook-toggle" onClick={@toggleInFlipbookMode}>
                <i className={"fa fa-fw " + if @state.inFlipbookMode then "fa-th-large" else "fa-film"}></i>
              </button>}

            {if not @state.inFlipbookMode or @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
              null
            else
              <span className="subject-frame-play-controls">
                {if @state.playing
                  <button aria-label="Pause" title="Pause" type="button" className="secret-button" onClick={@setPlaying.bind this, false}>
                    <i className="fa fa-pause fa-fw"></i>
                  </button>
                else
                  <button aria-label="Play" title="Play" type="button" className="secret-button" onClick={@setPlaying.bind this, true}>
                    <i className="fa fa-play fa-fw"></i>
                  </button>}
              </span>}
          </span>

    <div className={rootClasses} style={rootStyle}>
      {if type is 'image'
        @hiddenPreloadedImages()}
      <div className="subject-container" style={CONTAINER_STYLE} >
        {mainDisplay}
        {@props.children}
      </div>

      <div className="subject-tools">
        <span>{tools}</span>
        {if @props.subject?.locations.length >= 2 and @state.inFlipbookMode
          <span>
            <span className="subject-frame-pips">
              {for i in [0...@props.subject?.locations.length ? 0]
                <button type="button" key={i} className="subject-frame-pip #{if i is @state.frame then 'active' else ''}" value={i} onClick={@handleFrameChange.bind this, i}>{i + 1}</button>}
            </span>
        </span>}
        <span>
          {if @props.subject?.metadata?
            <button type="button" aria-label="Metadata" title="Metadata" className="metadata-toggle" onClick={@showMetadata}><i className="fa fa-info-circle fa-fw"></i></button>}
          {if @props.subject? and @props.user? and @props.project?
            <span>
              <FavoritesButton project={@props.project} subject={@props.subject} user={@props.user} />
              <CollectionsManagerIcon project={@props.project} subject={@props.subject} user={@props.user} />
            </span>}
          {if type is 'image' and @props.linkToFullImage
            <a className="button" href={src} aria-label="Subject Image" title="Subject Image" target="zooImage">
              <i className="fa fa-photo" />
            </a>}
        </span>
      </div>
    </div>



  renderFrame: (frame, props = {}) ->
    <FrameViewer {...@props} {...props} frame={frame} />

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

  toggleInFlipbookMode: () ->
    @setInFlipbookMode not @state.inFlipbookMode

  setInFlipbookMode: (inFlipbookMode) ->
    @setState {inFlipbookMode}

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
