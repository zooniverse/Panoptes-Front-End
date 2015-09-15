React = require 'react'
StickyModalForm = require 'modal-form/sticky'
ChangeListener = require '../../components/change-listener'

STROKE_WIDTH = 1.5
SELECTED_STROKE_WIDTH = 2.5

NON_MODAL_STYLE =
  bottom: null
  height: 0
  right: null
  width: '100%' # `0` makes for too-skinny children.

module.exports = React.createClass
  displayName: 'DrawingToolRoot'

  statics:
    distance: (x1, y1, x2, y2) ->
      Math.sqrt Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)

  getDefaultProps: ->
    tool: null

  getInitialState: ->
    destroying: false

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

    unless toolProps.disabled
      startHandler = toolProps.onSelect

    <g className="drawing-tool" {...rootProps} {...@props}>
      <g className="drawing-tool-main" {...mainStyle} onMouseDown={startHandler} onTouchStart={startHandler}>
        {@props.children}
      </g>

      {if toolProps.selected and toolProps.details? and toolProps.details.length isnt 0
        tasks = require '../tasks'
        <StickyModalForm ref="detailsForm" underlayStyle={NON_MODAL_STYLE} onSubmit={@handleDetailsFormClose} onCancel={@handleDetailsFormClose}>
          {for detailTask, i in toolProps.details
            detailTask._key ?= Math.random()
            TaskComponent = tasks[detailTask.type]
            <TaskComponent key={detailTask._key} task={detailTask} annotation={toolProps.mark.details[i]} onChange={toolProps.onChange} />}
          <hr />
          <p style={textAlign: 'center'}>
            <button type="submit" className="standard-button">OK</button>
          </p>
        </StickyModalForm>}
    </g>

  handleDetailsFormClose: ->
    # TODO: Check if the details tasks are complete.
    @props.tool.props.onDeselect?()
