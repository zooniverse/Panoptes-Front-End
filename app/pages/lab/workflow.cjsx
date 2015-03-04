React = require 'react'
handleInputChange = require '../../lib/handle-input-change'
PromiseRenderer = require '../../components/promise-renderer'
WorkflowTasksEditor = require '../../components/workflow-tasks-editor'
apiClient = require '../../api/client'
ChangeListener = require '../../components/change-listener'

EditWorkflowPage = React.createClass
  displayName: 'EditWorkflowPage'

  getDefaultProps: ->
    workflow: null

  render: ->
    projectAndWorkflowSubjectSets = Promise.all [
      @props.project.get 'subject_sets'
      @props.workflow.get 'subject_sets'
    ]

    <div className="columns-container">
      <div>
        <div>
          Name<br />
          <input type="text" name="display_name" value={@props.workflow.display_name} onChange={handleInputChange.bind @props.workflow} />
        </div>
        <div>
          Associated subject sets
          <PromiseRenderer promise={projectAndWorkflowSubjectSets}>{([projectSubjectSets, workflowSubjectSets]) =>
            <table>
              {for subjectSet in projectSubjectSets
                <tr key={subjectSet.id}>
                  <td><input type="checkbox" checked={subjectSet in workflowSubjectSets} /></td>
                  <td>{subjectSet.display_name}</td>
                </tr>}
            </table>
          }</PromiseRenderer>
        </div>
      </div>

      <div className="column">
        Tasks<br />
        <WorkflowTasksEditor workflow={@props.workflow} />
      </div>
    </div>

module.exports = React.createClass
  displayName: 'EditWorkflowPageWrapper'

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID}>{(workflow) =>
      <ChangeListener target={workflow}>{=>
        <EditWorkflowPage {...@props} workflow={workflow} />
      }</ChangeListener>
    }</PromiseRenderer>
