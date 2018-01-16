React = require 'react'
createReactClass = require 'create-react-class'

HidePreviousMarksToggle = createReactClass
  getDefaultProps: ->
    taskTypes: null
    workflow: null
    classification: null
    onChange: ->

  getInitialState: ->
    checked: false

  setPreviousMarks: (count) ->
    @props.classification._hideMarksBefore = count
    checked = count > 0
    @setState { checked }
    # this is a hack to force the parent to render again with marks hidden
    annotations = @props.classification.annotations.slice()
    annotation = annotations[annotations.length - 1]
    @props.onChange annotation

  render: ->
    annotations = @props.classification.annotations
    currentAnnotation = annotations[annotations.length-1]
    return null unless @props.workflow.tasks[currentAnnotation.task].enableHidePrevMarks


    DrawingTaskComponent = require '.' # Circular

    marksCount = 0
    annotations.forEach (annotation) =>
      taskDescription = @props.workflow.tasks[annotation.task]
      TaskComponent = @props.taskTypes[taskDescription.type]
      if TaskComponent is DrawingTaskComponent
        marksCount += annotation.value.length

    nextValueToSet = if @state.checked
      0
    else
      marksCount

    checkedStyle =
      background: 'rgba(255, 0, 0, 0.7)'
      color: 'white'

    <div>
      <label style={checkedStyle if @state.checked}>
        <input type="checkbox" checked={@state.checked} disabled={marksCount is 0} onChange={@setPreviousMarks.bind this, nextValueToSet} />{' '}
        Hide previous marks {if marksCount > 0 then '(' + marksCount + ')' }
      </label>
    </div>

module.exports = HidePreviousMarksToggle
