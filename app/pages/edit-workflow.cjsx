React = require 'react'
PromiseRenderer = require '../components/promise-renderer'
apiClient = require '../api/client'
WorkflowEditor = require '../components/workflow-editor'

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
    <WorkflowEditor workflow={workflow} />
