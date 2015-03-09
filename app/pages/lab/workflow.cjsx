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
    <div className="columns-container">
      <div className="column">
        <div>
          Name<br />
          <input type="text" name="display_name" value={@props.workflow.display_name} onChange={handleInputChange.bind @props.workflow} />
        </div>

        <div>
          Tasks<br />
          <ul>
          {for key, task of @props.workflow.tasks
            <li key={key} title={key}>{task.question ? task.instruction}</li>}
          </ul>
        </div>

        {@renderSubjectSets()}
      </div>

      <div className="column">
        Tasks<br />
        <WorkflowTasksEditor workflow={@props.workflow} />
      </div>
    </div>

  renderSubjectSets: ->
    projectAndWorkflowSubjectSets = Promise.all [
      @props.project.get 'subject_sets'
      @props.workflow.get 'subject_sets'
    ]

    <div>
      Associated subject sets
      <PromiseRenderer promise={projectAndWorkflowSubjectSets}>{([projectSubjectSets, workflowSubjectSets]) =>
        <table>
          {for subjectSet in projectSubjectSets
            <tr key={subjectSet.id}>
              <td><input type="checkbox" checked={subjectSet in workflowSubjectSets} onChange={@handleSubjectSetToggle.bind this, subjectSet} /></td>
              <td>{subjectSet.display_name}</td>
            </tr>}
        </table>
      }</PromiseRenderer>
    </div>

  handleSubjectSetToggle: (subjectSet, e) ->
    # TODO: This is totally untested; I have no idea if this is right.
    if e.checked
      @props.workflow.addLink 'subject_sets', subjectSet.id
    else
      @props.workflow.removeLink 'subject_sets', subjectSet.id

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
