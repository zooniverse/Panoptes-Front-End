React = require 'react'
Draggable = require '../lib/draggable'
LoadingIndicator = require '../components/loading-indicator'
drawingTools = require './drawing-tools'

READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']

ROOT_STYLE = display: 'block'
CONTAINER_STYLE = display: 'inline-block', position: 'relative'
SUBJECT_STYLE = display: 'block'
SVG_STYLE = height: '100%', left: 0, position: 'absolute', top: 0, width: '100%'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getInitialState: ->
    naturalWidth: 0
    naturalHeight: 0
    frame: 0

  getScale: ->
    ALMOST_ZERO = 0.01 # Prevent divide-by-zero errors when there is no image.
    rect = @refs.sizeRect?.getDOMNode().getBoundingClientRect()
    horizontal = (rect?.width || ALMOST_ZERO) / (@state.naturalWidth || ALMOST_ZERO)
    vertical = (rect?.height || ALMOST_ZERO) / (@state.naturalHeight || ALMOST_ZERO)
    {horizontal, vertical}

  getEventOffset: (e) ->
    rect = @refs.sizeRect.getDOMNode().getBoundingClientRect()
    scale = @getScale()
    x = (e.pageX - pageXOffset - rect.left) / scale.horizontal
    y = (e.pageY - pageYOffset - rect.top) / scale.vertical
    {x, y}

  render: ->
    for mimeType, src of @props.subject.locations[@state.frame]
      [subjectType, format] = mimeType.split '/'
      if subjectType of READABLE_FORMATS and format in READABLE_FORMATS[subjectType]
        subjectSrc = src
        break

    scale = @getScale()

    <div className="subject-area" style={ROOT_STYLE}>
      <div className="subject-container" style={CONTAINER_STYLE}>
        {switch subjectType
          when 'image' then <img className="subject" src={subjectSrc} style={SUBJECT_STYLE} onLoad={@handleSubjctImageLoad} />}

        <svg viewBox={[0, 0, @state.naturalWidth, @state.naturalHeight].join ' '} preserveAspectRatio="none" style={SVG_STYLE}>
          <rect ref="sizeRect" width="100%" height="100%" fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />

          {if @props.annotation?._toolIndex?
            <Draggable onStart={@handleInitStart} onDrag={@handleInitDrag} onEnd={@handleInitRelease}>
              <rect className="marking-initializer" width="100%" height="100%" fill="transparent" stroke="none" />
            </Draggable>}

          {for annotation, i in @props.classification.annotations when annotation.marks?
            disabled = annotation isnt @props.annotation
            <g key={i}>
              {for mark, i in annotation.marks
                tool = @props.workflow.tasks[annotation.task].tools[mark.tool]

                toolProps =
                  classification: @props.classification
                  annotation: annotation
                  tool: tool
                  mark: mark
                  scale: scale
                  disabled: disabled
                  selected: not disabled and i is annotation.marks.length - 1
                  select: @selectMark.bind this, mark
                  getEventOffset: @getEventOffset

                ToolComponent = drawingTools[tool.type]
                <ToolComponent key={Math.random()} {...toolProps} />}
            </g>}
        </svg>

        {if @props.loading
          <div className="is-loading">
            <LoadingIndicator />
          </div>}
      </div>

      <nav className="subject-tools">
        {unless @props.subject.locations.length is 0
          for i in [0...@props.subject.locations.length]
            <button type="button" key={i} className="subject-nav-pip" onClick={@handleChangeFrame.bind this, i}>{i}</button>}
      </nav>
    </div>

  handleSubjctImageLoad: (e) ->
    {naturalWidth, naturalHeight} = e.target
    unless @state.naturalWidth is naturalWidth and @state.naturalHeight is naturalHeight
      @setState {naturalWidth, naturalHeight}

  handleInitStart: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.marks[@props.annotation.marks.length - 1]

    markIsComplete = true
    if mark?
      MarkComponent = drawingTools[task.tools[mark.tool].type]
      if MarkComponent.isComplete?
        markIsComplete = MarkComponent.isComplete mark

    mouseCoords = @getEventOffset e

    if markIsComplete
      mark =
        tool: @props.annotation._toolIndex
      @props.annotation.marks.push mark
      MarkComponent = drawingTools[task.tools[mark.tool].type]

      if MarkComponent.defaultValues?
        defaultValues = MarkComponent.defaultValues mouseCoords
        for key, value of defaultValues
          mark[key] = value

    if MarkComponent.initStart?
      initValues = MarkComponent.initStart mouseCoords, mark, e
      for key, value of initValues
        mark[key] = value

    @props.classification.emit 'change'

  handleInitDrag: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.marks[@props.annotation.marks.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initMove?
      initMoveValues = MarkComponent.initMove mouseCoords, mark, e
      for key, value of initMoveValues
        mark[key] = value
      @props.classification.emit 'change'

  handleInitRelease: (e) ->
    task = @props.workflow.tasks[@props.annotation.task]
    mark = @props.annotation.marks[@props.annotation.marks.length - 1]
    MarkComponent = drawingTools[task.tools[mark.tool].type]

    mouseCoords = @getEventOffset e

    if MarkComponent.initRelease?
      initReleaseValues = MarkComponent.initRelease mouseCoords, mark, e
      for key, value of initReleaseValues
        mark[key] = value
      @props.classification.emit 'change'

  selectMark: (mark) ->
    index = @props.annotation.marks.indexOf mark
    unless index is -1
      @props.annotation.marks.splice index, 1
      @props.annotation.marks.push mark

  handleChangeFrame: (index) ->
    @setState frame: index
