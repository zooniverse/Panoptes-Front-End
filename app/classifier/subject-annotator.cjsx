React = require 'react'
SubjectViewer = require '../components/subject-viewer'
SVG = require '../components/svg'
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

  updateSize: ->
    @setState
      sizeRect: @refs.sizeRect?.getDOMNode().getBoundingClientRect()

  getScale: ->
    horizontal = @state.sizeRect?.width / @state.naturalWidth || 0
    vertical = @state.sizeRect?.height / @state.naturalHeight || 0
    {horizontal, vertical}

  getEventOffset: (e) ->
    scale = @getScale()
    x = (e.pageX - pageXOffset - @state.sizeRect?.left) / scale.horizontal || 0
    y = (e.pageY - pageYOffset - @state.sizeRect?.top) / scale.vertical || 0
    {x, y}

  render: ->
    taskDescription = @props.workflow.tasks[@props.annotation?.task]
    TaskComponent = tasks[taskDescription?.type]
    {type, format, src} = getSubjectLocation @props.subject, @state.frame

    if TaskComponent?
      {BeforeSubject, InsideSubject, AfterSubject} = TaskComponent
      hookProps =
        workflow: @props.workflow
        task: taskDescription
        classification: @props.classification
        annotation: @props.annotation
        frame: @state.frame
        scale: @getScale()
        containerRect: @state.sizeRect
        getEventOffset: this.getEventOffset

    <div className="subject-area">
      {if BeforeSubject?
        <BeforeSubject {...hookProps} />}

      <SubjectViewer user={@props.user} project={@props.project} subject={@props.subject} frame={@state.frame} onLoad={@handleSubjectFrameLoad} onFrameChange={@handleFrameChange}>
        <SVG ref="markingSurface" style={SubjectViewer.overlayStyle} naturalWidth={@state.naturalWidth} naturalHeight={@state.naturalHeight} onResize={@updateSize}>
          <rect ref="sizeRect" width={@state.naturalWidth} height={@state.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if type is 'image'
            <SVGImage src={src} width={@state.naturalWidth} height={@state.naturalHeight} />}

          {if InsideSubject?
            <InsideSubject {...hookProps} />}

          {for anyTaskName, {PersistInsideSubject} of tasks when PersistInsideSubject?
            <PersistInsideSubject key={anyTaskName} {...hookProps} />}
        </SVG>

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
    if e?.target?.tagName.toUpperCase() is 'IMG'
      {naturalWidth, naturalHeight} = e.target
      unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
        @setState {naturalWidth, naturalHeight}, ->
          # @refs.markingSurface.crop()
          @updateSize()

  handleFrameChange: (frame) ->
    @setState {frame}

  toggleWarning: ->
    @setState showWarning: not @state.showWarning
