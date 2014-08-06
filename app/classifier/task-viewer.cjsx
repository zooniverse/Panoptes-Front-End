# @cjsx React.DOM

React = require 'react'
{dispatch} = require '../lib/dispatcher'

taskComponents =
  radio: require './tasks/radio'

module.exports = React.createClass
  displayName: 'TaskViewer'

  render: ->
    TaskComponent = taskComponents[@props.task?.type]

    <div>
      {if TaskComponent?
        <TaskComponent question={@props.task.question} answers={@props.task.answers} answer={@props.annotation.answer} onChange={@props.onChange} />}
    </div>
