React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
StickyModalForm = require 'modal-form/sticky'
{ Provider } = require('react-redux')
ModalFocus = require('../../components/modal-focus').default
TaskTranslations = require('../tasks/translations').default
tasks = require('../tasks').default
DetailsSubTaskForm = require('./components/DetailsSubTaskForm').default

STROKE_WIDTH = 1.5
SELECTED_STROKE_WIDTH = 2.5

SEMI_MODAL_FORM_STYLE =
  pointerEvents: 'all'

SEMI_MODAL_UNDERLAY_STYLE =
  pointerEvents: 'none'
  backgroundColor: 'rgba(0, 0, 0, 0)'

module.exports = createReactClass
  displayName: 'DrawingToolRoot'

  contextTypes:
    store: PropTypes.object

  statics:
    distance: (x1, y1, x2, y2) ->
      Math.sqrt Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)

  getDefaultProps: ->
    tool: null

  getInitialState: ->
    destroying: false
  
  # In Chrome, refocusing the drawing tool without keeping track of scrollX and scrollY
  # would scroll volunteers to the top of an image upon drawing tool creation, selection, and deletion.
  componentDidMount: ->
    @focusDrawingTool()

  render: ->
    toolProps = @props.tool.props

    rootProps =
      'data-disabled': toolProps.disabled or null
      'data-selected': toolProps.selected or null
      'data-destroying': @props.tool.state?.destroying or null
      style: color: toolProps.color

    scale = (toolProps.scale.horizontal + toolProps.scale.vertical) / 2

    mainStyle =
      fill: 'transparent'
      stroke: 'currentColor'
      strokeWidth: if toolProps.selected
        SELECTED_STROKE_WIDTH / scale
      else
        STROKE_WIDTH / scale

    openDetails = toolProps.selected and not toolProps.mark._inProgress and toolProps.details? and toolProps.details.length isnt 0
    unless toolProps.disabled
      startHandler = (e) =>
        unless openDetails
          @focusDrawingTool()
        toolProps.onSelect(e)

    <g className="drawing-tool" {...rootProps} {...@props}>
      <g className="drawing-tool-main" ref={(element) => @root = element} {...mainStyle} onMouseDown={startHandler} onTouchStart={startHandler} tabIndex=-1>
        {@props.children}
      </g>

      {if openDetails
        <DetailsSubTaskForm
          handleDetailsChange={@handleDetailsChange}
          handleDetailsFormClose={@handleDetailsFormClose}
          ref={(node) => @detailsForm = node}
          tasks={tasks}
          toolProps={toolProps}
        />}
    </g>

  componentDidUpdate: ->
    this.detailsForm?.reposition()

  handleDetailsChange: (detailIndex, annotation) ->
    @props.tool.props.mark.details[detailIndex] = annotation
    @props.tool.props.onChange @props.tool.props.mark

  handleDetailsFormClose: ->
    # TODO: Check if the details tasks are complete.
    @props.tool.props.onDeselect?()
    @focusDrawingTool()

  focusDrawingTool: ->
    x = window.scrollX
    y = window.scrollY
    try @root?.focus()
    catch err then console.info('Edge currently does not support focus on SVG elements:', err)
    window.scrollTo(x, y)
