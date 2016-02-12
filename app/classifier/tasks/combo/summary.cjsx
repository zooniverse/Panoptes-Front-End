React = require 'react'

ComboTaskSummary = React.createClass
  getDefaultProps: ->
    task: null

  render: ->
    <div>
      ({@props.task.tasks.length}-task combo)
    </div>

module.exports = ComboTaskSummary
