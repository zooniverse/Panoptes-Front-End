React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
StickyModalForm = require 'modal-form/sticky'
{ Provider } = require('react-redux')
ModalFocus = require('../../components/modal-focus').default
TaskTranslations = require('../tasks/translations').default

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
        tasks = require('../tasks').default

        detailsAreComplete = toolProps.details.every (detailTask, i) =>
          TaskComponent = tasks[detailTask.type]
          if TaskComponent.isAnnotationComplete?
            TaskComponent.isAnnotationComplete detailTask, toolProps.mark.details[i]
          else
            true

        <StickyModalForm ref="detailsForm" style={SEMI_MODAL_FORM_STYLE} underlayStyle={SEMI_MODAL_UNDERLAY_STYLE} onSubmit={@handleDetailsFormClose} onCancel={@handleDetailsFormClose}>
          <Provider store={@context.store}>
            <ModalFocus onEscape={@handleDetailsFormClose} preserveFocus={false}>
              {for detailTask, i in toolProps.details
                detailTask._key ?= Math.random()
                TaskComponent = tasks[detailTask.type]
                taskKey = "#{toolProps.taskKey}.tools.#{toolProps.mark.tool}.details.#{i}"
                <TaskTranslations
                  key={detailTask._key}
                  taskKey={taskKey}
                  task={detailTask}
                >
                  <TaskComponent
                    autoFocus={i is 0}
                    task={detailTask}
                    annotation={toolProps.mark.details[i]}
                    onChange={@handleDetailsChange.bind this, i}
                    showRequiredNotice={true}
                  />
                </TaskTranslations>}
              <hr />
              <p style={textAlign: 'center'}>
                <button autoFocus={toolProps.details[0].type in ['single', 'multiple']} type="submit" className="standard-button" disabled={not detailsAreComplete}>OK</button>
              </p>
            </ModalFocus>
          </Provider>
        </StickyModalForm>}
    </g>

  componentDidUpdate: ->
    this.refs.detailsForm?.reposition()

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
    @root?.focus()
    window.scrollTo(x, y)
