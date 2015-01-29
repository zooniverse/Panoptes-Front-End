React = require 'react'
tasks = require './tasks'

module.exports = React.createClass
  displayName: 'ClassificationSummary'

  getDefaultProps: ->
    workflow: null
    classification: null

  render: ->
    <div className="classification-summary">
      {if @props.classification.annotations.length is 0
        'No annotations'
      else
        for annotation, i in @props.classification.annotations
          task = @props.workflow.tasks[annotation.task]
          SummaryComponent = tasks[task.type].Summary
          <SummaryComponent key={i} task={task} annotation={annotation} onToggle={@props.onToggle} />}
    </div>
