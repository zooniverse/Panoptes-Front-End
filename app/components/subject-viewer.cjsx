React = require 'react'
FavoritesButton = require '../collections/favorites-button'
Dialog = require 'modal-form/dialog'
{Markdown} = (require 'markdownz').default
getSubjectLocation = require '../lib/get-subject-location'
CollectionsManagerIcon = require '../collections/manager-icon'
FrameViewer = require './frame-viewer'
classnames = require 'classnames'
FlagSubjectButton = require './flag-subject-button'
SignInPrompt = require '../partials/sign-in-prompt'

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

  contextTypes:
    geordi: React.PropTypes.object

  signInAttentionTimeout: NaN

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
    metadataPrefixes: ['#', '!']
    metadataFilters: ['#', '!']
    workflow: null

  getInitialState: ->
    loading: true
    playing: false
    frame: @props.frame ? 0
    frameDimensions: {}
    inFlipbookMode: @props.allowFlipbook
    promptingToSignIn: false

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @props.subject
      clearTimeout @signInAttentionTimeout
      @setState loading: true

  logSubjClick: (logType) ->
    @context.geordi?.logEvent
      type: logType

  render: ->
    rootClasses = classnames('subject-viewer', {
      'default-root-style': @props.defaultStyle
      'subject-viewer--flipbook': @state.inFlipbookMode
      "subject-viewer--layout-#{@props.workflow?.configuration?.multi_image_layout}": @props.workflow?.configuration?.multi_image_layout
    })

    isIE = 'ActiveXObject' of window
    if isIE
      rootStyle = flex: '1 1 auto'

    mainDisplay = ''
    {type, format, src} = getSubjectLocation @props.subject, @state.frame
    if @state.inFlipbookMode
      mainDisplay = @renderFrame @state.frame
    else
      mainDisplay = @props.subject.locations.map (frame, index) =>
        @renderFrame index, {key: "frame-#{index}"}
    tools = switch type
      when 'image'
        if not @state.inFlipbookMode or @props.subject?.locations.length < 2 or subjectHasMixedLocationTypes @props.subject
          if @props.workflow?.configuration.enable_switching_flipbook_and_separate
            <button className="secret-button" aria-label="Toggle flipbook mode" title="Toggle flipbook mode" onClick={@toggleInFlipbookMode}>
              <i className={"fa fa-fw " + if @state.inFlipbookMode then "fa-th-large" else "fa-film"}></i>
            </button>
        else
          <span className="tools">
            {if @props.workflow?.configuration.enable_switching_flipbook_and_separate
              <button className="secret-button" aria-label="Toggle flipbook mode" title="Toggle flipbook mode" onClick={@toggleInFlipbookMode}>
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
          {if @props.workflow?.configuration?.invert_subject?
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
          {if @props.project? and @props.subject?
            if  @props.user?
              <span>
                {unless @props.workflow?.configuration?.disable_favorites
                  <span>
                    <FavoritesButton className="secret-button" project={@props.project} subject={@props.subject} user={@props.user} />{' '}
                  </span>}
                <CollectionsManagerIcon className="secret-button" project={@props.project} subject={@props.subject} user={@props.user} />
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
    @logSubjClick "metadata"
    # TODO: Sticky popup.
    Dialog.alert <div className="content-container">
      <header className="form-label" style={textAlign: 'center'}>Subject metadata</header>
      <hr />
      <table className="standard-table">
        <tbody>
          {for key, value of @props.subject?.metadata when key.charAt(0) not in @props.metadataFilters and key[...2] isnt '//'
            <tr key={key}>
              <th>{key.replace(///^(#{@props.metadataPrefixes.join('|')})///, '')}</th>
              <Markdown tag="td" content={value} inline />
            </tr>}
        </tbody>
      </table>
    </div>, closeButton: true
