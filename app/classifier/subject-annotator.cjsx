React = require 'react'
SubjectViewer = require '../components/subject-viewer'
SVGImage = require '../components/svg-image'
Draggable = require '../lib/draggable'
drawingTools = require './drawing-tools'
tasks = require './tasks'
Tooltip = require '../components/tooltip'
seenThisSession = require '../lib/seen-this-session'
getSubjectLocation = require '../lib/get-subject-location'

module.exports = React.createClass
  displayName: 'SubjectAnnotator'

  getDefaultProps: ->
    user: null
    project: null
    subject: null
    workflow: null
    classification: null
    annotation: null
    onLoad: Function.prototype

  getInitialState: ->
    frame: 0
    naturalWidth: 0
    naturalHeight: 0
    showWarning: false
    sizeRect: null

  componentDidMount: ->
    addEventListener 'resize', @updateSize
    @updateSize()
    @setState alreadySeen: @props.subject.already_seen or seenThisSession.check @props.workflow, @props.subject

  componentWillUnmount: ->
    removeEventListener 'resize', @updateSize

  componentWillReceiveProps: (nextProps) ->
    if nextProps.annotation isnt @props.annotation
      @handleAnnotationChange @props.annotation, nextProps.annotation

  handleAnnotationChange: (oldAnnotation, currentAnnotation) ->
    if oldAnnotation?
      # console.log 'Old annotation was', oldAnnotation
      lastTask = @props.workflow.tasks[oldAnnotation.task]
      LastTaskComponent = tasks[lastTask.type]
      if LastTaskComponent.onLeaveAnnotation?
        LastTaskComponent.onLeaveAnnotation lastTask, oldAnnotation
    # if currentAnnotation?
    #   console.log 'Annotation is now', currentAnnotation
    setTimeout => # Wait a tick for the annotation to load.
      @updateSize()

  updateSize: ->
    clientRect = @refs.sizeRect?.getDOMNode().getBoundingClientRect() # Read only
    {left, right, top, bottom, width, height} = clientRect
    left += pageXOffset
    right += pageXOffset
    top += pageYOffset
    bottom += pageYOffset
    @setState sizeRect: {left, right, top, bottom, width, height}

  getScale: ->
    horizontal = @state.sizeRect?.width / @state.naturalWidth || 0
    vertical = @state.sizeRect?.height / @state.naturalHeight || 0
    {horizontal, vertical}

  getEventOffset: (e) ->
    scale = @getScale()
    console?.log 'Subject scale is', JSON.stringify scale
    x = (e.pageX - @state.sizeRect?.left) / scale.horizontal || 0
    y = (e.pageY - @state.sizeRect?.top) / scale.vertical || 0
    {x, y}

  render: ->
    taskDescription = @props.workflow.tasks[@props.annotation?.task]
    TaskComponent = tasks[taskDescription?.type]
    {type, format, src} = getSubjectLocation @props.subject, @state.frame

    svgStyle = {}
    if type is 'image'
      # Images are rendered again within the SVG itself.
      # When cropped right next to the edge of the image,
      # the original tag can show through, so fill the SVG to cover it.
      svgStyle.background = 'black'

    svgProps = {}

    if TaskComponent?
      {BeforeSubject, InsideSubject, AfterSubject} = TaskComponent

    hookProps =
      workflow: @props.workflow
      task: taskDescription
      classification: @props.classification
      annotation: @props.annotation
      frame: @state.frame
      scale: @getScale()
      naturalWidth: @state.naturalWidth
      naturalHeight: @state.naturalHeight
      containerRect: @state.sizeRect
      getEventOffset: this.getEventOffset

    for task, Component of tasks when Component.getSVGProps?
      for key, value of Component.getSVGProps hookProps
        svgProps[key] = value

    <div className="subject-area">
      {if BeforeSubject?
        <BeforeSubject {...hookProps} />}

      <SubjectViewer user={@props.user} project={@props.project} subject={@props.subject} frame={@state.frame} onLoad={@handleSubjectFrameLoad} onFrameChange={@handleFrameChange}>
        <svg style={Object.assign {}, SubjectViewer.overlayStyle, svgStyle} viewBox="0 0 #{@state.naturalWidth} #{@state.naturalHeight}" {...svgProps}>
          <rect ref="sizeRect" width={@state.naturalWidth} height={@state.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if type is 'image'
            <SVGImage src={src} width={@state.naturalWidth} height={@state.naturalHeight} />}

          {if InsideSubject?
            <InsideSubject {...hookProps} />}

          {for anyTaskName, {PersistInsideSubject} of tasks when PersistInsideSubject?
            <PersistInsideSubject key={anyTaskName} {...hookProps} />}
        </svg>

        {if @state.alreadySeen
          <button type="button" className="warning-banner" onClick={@toggleWarning}>
            Already seen!
            {if @state.showWarning
              <Tooltip attachment="top left" targetAttachment="middle right">
                <p>Our records show that you’ve already seen this image. We might have run out of data for you in this workflow!</p>
                <p>Try choosing a different workflow or contributing to a different project.</p>
              </Tooltip>}
          </button>

        else if @props.subject.retired
          <button type="button" className="warning-banner" onClick={@toggleWarning}>
            Retired!
            {if @state.showWarning
              <Tooltip attachment="top left" targetAttachment="middle right">
                <p>This subject already has enough classifications, so yours won’t be used in its analysis!</p>
                <p>If you’re looking to help, try choosing a different workflow or contributing to a different project.</p>
              </Tooltip>}
          </button>}
      </SubjectViewer>

      {if AfterSubject?
        <AfterSubject {...hookProps} />}
    </div>

  handleSubjectFrameLoad: (e) ->
    @props.onLoad? e, @state.frame
    {naturalWidth, naturalHeight} = e.target
    unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
      @setState {naturalWidth, naturalHeight}, =>
        @updateSize()

  handleFrameChange: (frame) ->
    @setState {frame}

  toggleWarning: ->
    @setState showWarning: not @state.showWarning
