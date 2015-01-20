React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
WorkflowTasksEditor = require '../components/workflow-tasks-editor'

module.exports = React.createClass
  displayName: 'EditWorkflowPage'

  getDefaultProps: ->
    params: {}

  render: ->
    <PromiseRenderer promise={apiClient.createType('workflows').get @props.params.id} then={@renderWorkflowEditor}>
      <div className="content-container">
        <p>Loading workflow <code>{@props.params.id}</code>...</p>
      </div>
    </PromiseRenderer>

  renderWorkflowEditor: (workflow) ->
    <div>
      <WorkflowTasksEditor workflow={workflow} />
    </div>
