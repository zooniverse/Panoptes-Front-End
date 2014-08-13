# @cjsx React.DOM

React = require 'react'
LoadingIndicator = require '../components/loading-indicator'

taskComponents =
  radio: require './tasks/radio'

module.exports = React.createClass
  displayName: 'TaskViewer'

  render: ->
    if @props?.workflow and @props.annotation
      task = @props.workflow.tasks[@props.annotation.task]
      TaskComponent = taskComponents[task?.type]

      <div>
        {if TaskComponent?
          <TaskComponent question={task.question} answers={task.answers} answer={@props.annotation.answer} onChange={@props.onChange} />}
      </div>

    else
      <p>Loading task <LoadingIndicator /></p>
