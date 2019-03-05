React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
FavoritesButton = require('../collections/favorites-button').default
Dialog = require 'modal-form/dialog'
{Markdown} = require 'markdownz'
classnames = require 'classnames'
getSubjectLocation = require '../lib/get-subject-location'
FlagSubjectButton = require './flag-subject-button'
SignInPrompt = require '../partials/sign-in-prompt'
FrameViewer = require('./frame-viewer').default
CollectionsManagerIcon = require('../collections/manager-icon').default
getSubjectLocations = require('../lib/get-subject-locations').default

NOOP = Function.prototype

subjectTypes = (subject) ->
  allTypes = []
  (subject?.locations ? []).forEach (location) ->
    Object.keys(location).forEach (typeAndFormat) ->
      type = typeAndFormat.split('/')[0]
      unless type in allTypes
        allTypes.push type
  # this line seems to be required, but that shouldn't be the case
  return allTypes

subjectHasMixedLocationTypes = (subject) ->
  allTypes = subjectTypes subject
  allTypes.length > 1

subjectIsLikelyAudioPlusImage = (subject) ->
  if parseInt(subject?.metadata?.image_with_audio?, 0) > 0
    true
  else
    allTypes = subjectTypes subject
    allTypes.length == 2 and allTypes.includes('audio') and allTypes.includes('image')

CONTAINER_STYLE = display: 'flex', flexWrap: 'wrap', position: 'relative'

module.exports = createReactClass
  displayName: 'SubjectViewer'

  contextTypes:
    geordi: PropTypes.object

  signInAttentionTimeout: NaN

  getDefaultProps: ->
    subject: null
    isFavorite: false
    user: null
    playIterations: 3
    onFrameChange: NOOP
    onLoad: NOOP
    defaultStyle: true
    project: null
    linkToFullImage: false
    frameWrapper: null
    allowFlipbook: true
    allowSeparateFrames: false
    showCollect: true
    talkInvert: false
    metadataPrefixes: ['#', '!']
    metadataFilters: ['#', '!']
    workflow: null

  getInitialState: ->
    loading: true
    playing: false
    frame: @getInitialFrame()
    frameDimensions: {}
    frameDurationRate: 2
    frameDurationIntervalId: null
    inFlipbookMode: @props.allowFlipbook
    invert: false
    promptingToSignIn: false

  getInitialFrame: ->
    {frame, allowFlipbook, subject} = @props
    default_frame = parseInt(subject.metadata?.default_frame, 10)
    initialFrame = 0
    if frame?
      initialFrame = frame
    else if allowFlipbook and typeof default_frame is 'number' and !isNaN(default_frame) and default_frame > 0 and default_frame <= subject.locations.length
      initialFrame = default_frame - 1
    initialFrame

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @props.subject
      clearTimeout @signInAttentionTimeout
      @setState
        playing: false
        loading: true
        frame: 0

  componentDidUpdate: (prevProps) ->
    if @props.subject isnt prevProps.subject
      # turn off the slideshow player and reset any counters
      @setPlaying false
      @setState frame: @getInitialFrame()

  logSubjClick: (logType) ->
    @context.geordi?.logEvent
      type: logType

  render: ->
    rootClasses = classnames('subject-viewer', {
      'default-root-style': @props.defaultStyle
      'subject-viewer--flipbook': @state.inFlipbookMode
      'subject-viewer--invert': @state.invert
      "subject-viewer--layout-#{@props.workflow?.configuration?.multi_image_layout}": @props.workflow?.configuration?.multi_image_layout
    })

    isIE = 'ActiveXObject' of window
    if isIE
      rootStyle = flex: '1 1 auto'

    mainDisplay = ''
    {type, format, src} = getSubjectLocation @props.subject, @state.frame
    subjectLocations = getSubjectLocations @props.subject
    if subjectIsLikelyAudioPlusImage @props.subject
          mainDisplay = @renderFrame @state.frame, {subjectLocations : subjectLocations, isAudioPlusImage : true}
    else if @state.inFlipbookMode
      mainDisplay = @renderFrame @state.frame
    else
      mainDisplay = @props.subject.locations.map (frame, index) =>
        @renderFrame index, {key: "frame-#{index}"}
    tools = switch type
      when 'image', 'application'
        if not @state.inFlipbookMode or @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
          if @props.workflow?.configuration.enable_switching_flipbook_and_separate
            <button
              className="secret-button"
              aria-label="Toggle flipbook mode"
              title="Toggle flipbook mode"
              onClick={@toggleInFlipbookMode}
              disabled={@state.loading}
            >
              <i className={"fa fa-fw " + if @state.inFlipbookMode then "fa-th-large" else "fa-film"}></i>
            </button>
        else
          <span className="tools">
            {if @props.workflow?.configuration.enable_switching_flipbook_and_separate
              <button
                className="secret-button"
                aria-label="Toggle flipbook mode"
                title="Toggle flipbook mode"
                onClick={@toggleInFlipbookMode}
                disabled={@state.loading}
              >
                <i className={"fa fa-fw " + if @state.inFlipbookMode then "fa-th-large" else "fa-film"}></i>
              </button>}

            {if not @state.inFlipbookMode or @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
              null
            else
              <span>
                {if @state.playing
                  <button aria-label="Pause" title="Pause" type="button" className="secret-button subject-tools__play" onClick={@setPlaying.bind this, false}>
                    <i className="fa fa-pause fa-lg fa-fw"></i>
                  </button>
                else
                  <button aria-label="Play" title="Play" type="button" className="secret-button subject-tools__play" onClick={@setPlaying.bind this, true}>
                    <i className="fa fa-play fa-lg fa-fw"></i>
                  </button>}
                <div className="subject-frame-duration">
                  <button
                    aria-label="Slower"
                    className="secret-button"
                    onKeyDown={@keyDownFrameDuration.bind this, -0.25}
                    onMouseDown={@mouseDownFrameDuration.bind this, -0.25}
                    onMouseUp={@clearFrameDurationInterval}
                    onMouseOut={@clearFrameDurationInterval}
                    title="Slower"
                    type="button"
                  >
                    <i className="fa fa-angle-right fa-lg fa-fw subject-frame-duration--slower"></i>
                  </button>
                  <input
                    aria-label="Playback Speed Rate Adjustment"
                    className="subject-frame-duration--range"
                    id="frame-duration"
                    max="10"
                    min="0.25"
                    name="frame-duration"
                    onChange={@handleFrameDurationChange}
                    step="0.25"
                    type="range"
                    value={@state.frameDurationRate}
                  />
                  <button
                    aria-label="Faster"
                    className="secret-button"
                    onKeyDown={@keyDownFrameDuration.bind this, 0.25}
                    onMouseDown={@mouseDownFrameDuration.bind this, 0.25}
                    onMouseUp={@clearFrameDurationInterval}
                    onMouseOut={@clearFrameDurationInterval}
                    title="Faster"
                    type="button"
                  >
                    <i className="fa fa-angle-double-right fa-lg fa-fw subject-frame-duration--faster"></i>
                  </button>
                </div>
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
        {if @props.subject?.locations.length >= 2 and not subjectIsLikelyAudioPlusImage(@props.subject) and @state.inFlipbookMode
          <span>
            <span className="subject-frame-pips">
              {for i in [0...@props.subject?.locations.length ? 0]
                <label key={@props.subject.locations[i]["#{type}/#{format}"]} className="button subject-frame-pip #{if i is @state.frame then 'active' else ''}" >
                  <input type="radio" name="frame" value={i} onChange={@handleFrameChange.bind this, i} />{i + 1}
                </label>}
            </span>
        </span>}
        <span>
          {if @props.workflow?.configuration?.invert_subject or @props.talkInvert
            <button type="button" className="secret-button" aria-label="Invert image" title="Invert image" onClick={@toggleModification.bind this, 'invert'}>
              <i className="fa fa-adjust "></i>
            </button>}{' '}
          {if @props.workflow?.configuration?.enable_subject_flags
            <span>
              <FlagSubjectButton className="secret-button" classification={@props.classification} />{' '}
            </span>}
          {if @props.subject?.metadata?
            <span>
              <button type="button" className="secret-button" aria-label="Metadata" title="Metadata" onClick={@showMetadata}>
                <i className="fa fa-info-circle fa-fw"></i>
              </button>{' '}
            </span>}
          {if @props.subject?
            if @props.user?
              <span>
                {if @props.project? and not @props.workflow?.configuration?.disable_favorites
                  <span>
                    <FavoritesButton className="secret-button" project={@props.project} subject={@props.subject} user={@props.user} isFavorite={@props.isFavorite} />{' '}
                  </span>}
                {if @props.showCollect
                  <CollectionsManagerIcon className="secret-button" project={@props.project} subject={@props.subject} user={@props.user} />}
              </span>
            else
              <span>
                <button type="button" className="secret-button #{if @state.loading then 'get-attention'}" onClick={=> @setState promptingToSignIn: true}>
                  <small>You should sign in!</small>
                </button>
                {if @state.promptingToSignIn
                  <Dialog>
                    <SignInPrompt onChoose={=> @setState promptingToSignIn: false}>
                      <p>Sign in to help us make the most out of your hard work.</p>
                    </SignInPrompt>
                  </Dialog>}
              </span>}
          {if type is 'image' and @props.linkToFullImage
            <a className="button" onClick={@logSubjClick.bind this, "subject-image"} href={src} aria-label="Subject Image" title="Subject Image" target="zooImage">
              <i className="fa fa-photo" />
            </a>}
        </span>
      </div>
    </div>

  handleFrameLoad: ->
    @props.onLoad? arguments...
    @signInAttentionTimeout = setTimeout (=> @setState loading: false), 3000

  renderFrame: (frame, props = {}) ->
    <FrameViewer {...@props} {...props} frame={frame} modification={@state?.modification} onLoad={@handleFrameLoad} />

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

  toggleModification: (type) ->
    if type is 'invert'
      @setState (prevState) -> { invert: !prevState.invert }

    mods = @state?.modification
    if !mods
      mods = {}
    if mods[type] is undefined
      mods[type] = true
    else
      mods[type] = not mods[type]
    @setState modification: mods

  setInFlipbookMode: (inFlipbookMode) ->
    @setState {inFlipbookMode}

  setPlaying: (playing) ->
    @setState {playing}
    totalFrames = @props.subject.locations.length
    flips = totalFrames * @props.playIterations
    infiniteLoop = @props.playIterations is ''
    counter = 0

    flip = =>
      if @state.playing is on and (counter < flips or infiniteLoop is on)
        counter++
        @handleFrameChange (@state.frame + 1) %% totalFrames
        setTimeout flip, (1000 / @state.frameDurationRate)
        if counter is flips and infiniteLoop is off
          @setPlaying false
      else @setPlaying false

    if playing is on
      setTimeout flip, 0

  handleFrameDurationChange: (event) ->
    @setState frameDurationRate: parseFloat(event.target.value)

  keyDownFrameDuration: (step, event) ->
    if event.which is 13 or event.which is 32
      @changeFrameDuration(step)

  mouseDownFrameDuration: (step) ->
    @clearFrameDurationInterval()
    @setState frameDurationIntervalId: setInterval (=> @changeFrameDuration step), 100

  changeFrameDuration: (step) ->
    if 0.25 <= (@state.frameDurationRate + step) <= 10
      @setState frameDurationRate: @state.frameDurationRate + step

  clearFrameDurationInterval: () ->
    if @state.frameDurationIntervalId
      clearTimeout @state.frameDurationIntervalId

  handleFrameChange: (frame) ->
    @setState {frame}
    @props.onFrameChange frame

  showMetadata: ->
    @logSubjClick "metadata"
    # TODO: Sticky popup.
    Dialog.alert <div className="content-container">
      <header className="form-label" style={textAlign: 'center'}>Subject metadata</header>
      <hr />
      <table className="standard-table">
        <tbody>
          {for key, value of @props.subject?.metadata when key.trim().charAt(0) not in @props.metadataFilters and key[...2] isnt '//'
            if value
              if value.trim
                value = value.trim()
              if (value.startsWith and value.startsWith('http'))
                value = "[#{value}](+tab+#{value})"
            <tr key={key}>
              <th>{key.replace(///^(#{@props.metadataPrefixes.join('|')})///, '')}</th>
              <Markdown tag="td" content={value} inline />
            </tr>}
        </tbody>
      </table>
    </div>, closeButton: true
