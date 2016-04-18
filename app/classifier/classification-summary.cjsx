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
        for annotation in @props.classification.annotations
          annotation._key = Math.random()
          task = @props.workflow.tasks[annotation.task]
          SummaryComponent = tasks[task.type].Summary # TODO: There's a lot of duplicated code in these modules.
          <div key={annotation._key} className="classification-task-summary">
            <SummaryComponent task={task} annotation={annotation} onToggle={@props.onToggle} />
          </div>}
    </div>
