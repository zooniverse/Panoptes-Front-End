React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'
{TextSplit} = require 'seven-ten'
tasks = require './tasks'

module.exports = React.createClass
  displayName: 'ClassificationSummary'

  getDefaultProps: ->
    workflow: null
    classification: null
    classificationCount: null

  render: ->
    # first time the subject was classified
    firstTimeClassified = @props.classificationCount? and @props.classificationCount is 0

    <div className="classification-summary">
      {if firstTimeClassified
        <TextSplit splitKey="subject.first-to-classify"
          textKey="message"
          splits={this.props.splits}
          default={''}
          elementType={"p"} />}

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
