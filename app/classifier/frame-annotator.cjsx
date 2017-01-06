React = require 'react'
Draggable = require '../lib/draggable'
tasks = require './tasks'
seenThisSession = require '../lib/seen-this-session'
getSubjectLocation = require '../lib/get-subject-location'
WarningBanner = require './warning-banner'
`import SVGImage from '../components/svg-image';`

module.exports = React.createClass
  displayName: 'FrameAnnotator'

  getDefaultProps: ->
    user: null
    project: null
    subject: null
    workflow: null
    classification: null
    annotation: null
    onLoad: Function.prototype
    frame: 0
    onChange: Function.prototype

  getInitialState: ->
    alreadySeen: false
    showWarning: false

  componentDidMount: ->
    @setState alreadySeen: @props.subject.already_seen or seenThisSession.check @props.workflow, @props.subject

  componentWillReceiveProps: (nextProps) ->
    if nextProps.annotation isnt @props.annotation
      @handleAnnotationChange @props.annotation, nextProps.annotation

  handleAnnotationChange: (oldAnnotation, currentAnnotation) ->
    if oldAnnotation?
      lastTask = @props.workflow.tasks[oldAnnotation.task]
      LastTaskComponent = tasks[lastTask.type]
      if LastTaskComponent.onLeaveAnnotation?
        LastTaskComponent.onLeaveAnnotation lastTask, oldAnnotation

  getSizeRect: ->
    clientRect = @refs.sizeRect?.getBoundingClientRect() # Read only
    return null unless clientRect?
    {left, right, top, bottom, width, height} = clientRect
    left += pageXOffset
    right += pageXOffset
    top += pageYOffset
    bottom += pageYOffset
    {left, right, top, bottom, width, height}

  getScale: ->
    sizeRect = @getSizeRect()
    horizontal = sizeRect?.width / @props.naturalWidth || 0
    vertical = sizeRect?.height / @props.naturalHeight || 0
    {horizontal, vertical}

  # get current transformation matrix
  getScreenCurrentTransformationMatrix: ()->
    svg = @refs.svgSubjectArea
    matrix = svg.getScreenCTM()

  # transforms the event coordinates 
  # to points in the SVG coordinate system
  eventCoordsToSVGCoords: (x, y) ->
    svg = @refs.svgSubjectArea
    newPoint = svg.createSVGPoint()
    newPoint.x = x
    newPoint.y = y
    matrixForWindowCoordsToSVGUserSpaceCoords = @getMatrixForWindowCoordsToSVGUserSpaceCoords()
    pointForSVGSystem = newPoint.matrixTransform(matrixForWindowCoordsToSVGUserSpaceCoords)
    pointForSVGSystem

  # find the original matrix for the SVG coordinate system
  getMatrixForWindowCoordsToSVGUserSpaceCoords: ->
    transformationContainer = @refs.transformationContainer
    transformationContainer.getScreenCTM().inverse()

  # transforms the difference between two event coordinates
  # into the difference as represent in the SVG coordinate system
  normalizeDifference: (e, d) ->
    difference = {}
    normalizedPoint1 = @eventCoordsToSVGCoords(e.pageX - d.x, e.pageY - d.y)
    normalizedPoint2 = @eventCoordsToSVGCoords(e.pageX, e.pageY)
    difference.x =  normalizedPoint2.x - normalizedPoint1.x
    difference.y =  normalizedPoint2.y - normalizedPoint1.y
    difference

  # get the offset of event coordiantes in terms of the SVG coordinate system
  getEventOffset: (e) ->
    eventOffset = @eventCoordsToSVGCoords(e.clientX, e.clientY)

  render: ->
    taskDescription = @props.workflow.tasks[@props.annotation?.task]
    TaskComponent = tasks[taskDescription?.type]
    {type, format, src} = getSubjectLocation @props.subject, @props.frame

    createdViewBox = "#{@props.viewBoxDimensions.x} #{@props.viewBoxDimensions.y} #{@props.viewBoxDimensions.width} #{@props.viewBoxDimensions.height}"

    svgStyle = {}
    if type is 'image' and not @props.loading
      # Images are rendered again within the SVG itself.
      # When cropped right next to the edge of the image,
      # the original tag can show through, so fill the SVG to cover it.
      svgStyle.background = 'black'

      # Allow touch scrolling on subject for mobile and tablets
      unless taskDescription?.type is 'drawing' or taskDescription?.type is 'crop'
        svgStyle.pointerEvents = 'none'
      if @props.panEnabled is true
        svgStyle.pointerEvents = 'all'

    svgProps = {}

    if TaskComponent?
      {BeforeSubject, InsideSubject, AfterSubject} = TaskComponent

    hookProps =
      taskTypes: tasks
      workflow: @props.workflow
      task: taskDescription
      classification: @props.classification
      annotation: @props.annotation
      frame: @props.frame
      scale: @getScale()
      naturalWidth: @props.naturalWidth
      naturalHeight: @props.naturalHeight
      containerRect: @getSizeRect()
      getEventOffset: this.getEventOffset
      onChange: @props.onChange
      preferences: @props.preferences
      normalizeDifference: @normalizeDifference
      getScreenCurrentTransformationMatrix: @getScreenCurrentTransformationMatrix

    for task, Component of tasks when Component.getSVGProps?
      for key, value of Component.getSVGProps hookProps
        svgProps[key] = value

    <div className="frame-annotator">
      <div className="subject-area">
        {if BeforeSubject?
          <BeforeSubject {...hookProps} />}
        <svg ref="svgSubjectArea" className="subject" style=svgStyle viewBox={createdViewBox} {...svgProps}>
          <g ref="transformationContainer" transform={@props.transform} >
            <rect ref="sizeRect" width={@props.naturalWidth} height={@props.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />
            {if type is 'image'
              <Draggable onDrag={@props.panByDrag} disabled={@props.disabled}>
                <SVGImage className={"pan-active" if @props.panEnabled} src={src} width={@props.naturalWidth} height={@props.naturalHeight} modification={@props.modification} />
              </Draggable>
            }

            {if InsideSubject? && !@props.panEnabled
              <InsideSubject {...hookProps} />}

            {for anyTaskName, {PersistInsideSubject} of tasks when PersistInsideSubject?
              <PersistInsideSubject key={anyTaskName} {...hookProps} />}
          </g>
        </svg>
        {@props.children}
        {if @state.alreadySeen
          <WarningBanner label="Already seen!">
            <p>Our records show that you’ve already seen this image. We might have run out of data for you in this workflow!</p>
            <p>Try choosing a different workflow or contributing to a different project.</p>
          </WarningBanner>

        else if @props.subject.retired
          <WarningBanner label="Finished!">
            <p>This subject already has enough classifications, so yours won’t be used in its analysis!</p>
            <p>If you’re looking to help, try choosing a different workflow or contributing to a different project.</p>
          </WarningBanner>
        }

        {if AfterSubject?
          <AfterSubject {...hookProps} />}
      </div>
    </div>
