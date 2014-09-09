# @cjsx React.DOM

React = require 'react'
classificationsStore = require '../data/classifications'
subjectsStore = require '../data/subjects'
loadImage = require '../lib/load-image'
merge = require 'react/lib/merge'
SVGImage = require '../components/svg-image'

drawingComponents =
  point: require './drawing-tools/point'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getInitialState: ->
    loading: false
    classification: null
    subject: null
    frame: 0

    imageWidth: 0
    imageHeight: 0

    # NOTE: We'll only change viewX and viewY if we support zoom later.
    viewX: 0
    viewY: 0
    viewWidth: 0
    viewHeight: 0

  componentDidMount: ->
    console.log 'SubjectViewer::componentDidMount'
    @loadClassification @props.classification

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.classification in [@state.classification?.id, @state.loading]
      @loadClassification nextProps.classification

  loadClassification: (id) ->
    console.log 'SubjectViewer::loadClassification'
    @setState loading: id, =>
      console.log 'Loading classification', id
      classificationsStore.get(id).then (classification) =>
        console.log 'Loading subject', classification.subject
        subjectsStore.get(classification.subject).then (subject) =>
          console.log 'Loading image', subject.location[0]
          loadImage(subject.location[0]).then (img) =>
            if @isMounted()
              console.log 'Setting state'
              @setState
                loading: false
                classification: classification
                subject: subject
                frame: 0
                imageWidth: img.width
                imageHeight: img.height
                viewX: 0
                viewY: 0
                viewWidth: img.width
                viewHeight: img.height
                -> console.log 'Done'

  setFrame: (frame) ->
    @setState frame: frame, =>
      loadImage(@state.subject.location[frame]).then (img) =>
        if @isMounted()
          @setState
            loading: false
            imageWidth: img.width
            imageHeight: img.height

  getScale: ->
    rect = @refs.svg?.getDOMNode().getBoundingClientRect()
    rect ?= width: 0, height: 0
    horizontal: rect.width / @state.viewWidth
    vertical: rect.height / @state.viewHeight

  getEventOffset: (e) ->
    rect = @refs.svg.getDOMNode().getBoundingClientRect()
    {horizontal, vertical} = @getScale()
    console.log {horizontal}, {vertical}
    x: ((e.pageX - pageXOffset - rect.left) / horizontal) + @state.viewX
    y: ((e.pageY - pageYOffset - rect.top) / vertical) + @state.viewY

  render: ->
    if @state.classification? and @state.subject?
      scale = @getScale()

      drawnComponents = []
      for {marks}, a in @state.classification.annotations when marks?
        for mark, m in marks
          Tool = drawingComponents[mark.type]
          drawnComponents.push new Tool merge mark, scale: scale, key: "#{a}#{m}" # TODO: How can we itentify these uniquely?

      <svg ref="svg" className="subject-viewer-svg" viewBox="#{@state.viewX} #{@state.viewY} #{@state.viewWidth ? 0} #{@state.viewHeight ? 0}" data-tool={@props.drawingTool?.type} onMouseDown={@handleSVGMouseDown}>
        <SVGImage src={@state.subject.location[@state.frame]} width={@state.imageWidth} height={@state.imageHeight} />
        {drawnComponents}
      </svg>

    else
      <p>Loading subject viewer</p>

  handleSVGMouseDown: (e) ->
    mouse = @getEventOffset e
    if @props.drawingTool?
      mouse.type = @props.drawingTool.type

      annotation = @state.classification.annotations[@state.classification.annotations.length - 1]
      annotation.marks ?= []

      @state.classification.apply =>
        annotation.marks.push mouse

    console.log 'SVG moused at', mouse
