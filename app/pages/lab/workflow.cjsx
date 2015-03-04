React = require 'react'
PromiseRenderer = require '../../components/promise-renderer'
apiClient = require '../../api/client'

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
          <input type="text" placeholder="Workflow name" />
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
        (Workflow tasks editor)
      </div>
    </div>

module.exports = React.createClass
  displayName: 'EditWorkflowPageWrapper'

  getDefaultProps: ->
    params: null

  render: ->
    <PromiseRenderer promise={apiClient.type('workflows').get @props.params.workflowID}>{(workflow) =>
      <EditWorkflowPage {...@props} workflow={workflow} />
    }</PromiseRenderer>
