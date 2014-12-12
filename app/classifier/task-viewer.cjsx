React = require 'react'
LoadingIndicator = require '../components/loading-indicator'

taskComponents =
  single: require './tasks/single'
  multiple: require './tasks/multiple'
  drawing: require './tasks/drawing'

module.exports = React.createClass
  displayName: 'TaskViewer'

  render: ->
    TaskComponent = taskComponents[@props.task.type]

    <div className="task-viewer">
      {if TaskComponent?
        <TaskComponent question={@props.task.question} options={@props.task.answers ? @props.task.tools} value={@props.annotation.answer ? @props.selectedDrawingTool} onChange={@props.onChange} />
      else
        <strong>Task type "{@props.task.type}" not recognized.</strong>}
    </div>
