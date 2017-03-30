import React from 'react';
import { Link } from 'react-router';
import DragReorderable from 'drag-reorderable';
import ModalFormDialog from 'modal-form/dialog';
import Paginator from '../../talk/lib/paginator';
import WorkflowCreateForm from './workflow-create-form';
import LoadingIndicator from '../../components/loading-indicator';

const WorkflowsPage = (props) => {
  const meta = props.workflows.length ? props.workflows[0].getMeta() : {};

  const renderWorkflow = ((workflow) => {
    return (
      <li key={workflow.id}>
        <Link key={workflow.id} to={props.labPath(`/workflow/${workflow.id}`)} className="nav-list-item" activeClassName="active">
          {workflow.display_name}
          {workflow.id === props.project.configuration.default_workflow && (
            <span title="Default workflow">{' '}*{' '}</span>
          )}
        </Link>
      </li>
    );
  });

  return (
    <div>
      <div className="form-label">Workflows</div>

      <DragReorderable tag="ul" className="nav-list" items={props.workflows} render={renderWorkflow} onChange={props.handleWorkflowReorder} />

      {(props.workflows.length === 0 && props.loading === false) && (
        <p>No workflows are currently associated with this project.</p>
      )}

      <div className="nav-list-item">
        <button
          type="button"
          onClick={props.showCreateWorkflow}
          disabled={props.workflowCreationInProgress}
          title="A workflow is the sequence of tasks that you’re asking volunteers to perform."
        >
          New workflow{' '}
          <LoadingIndicator off={!props.workflowCreationInProgress} />
        </button>
      </div>

      {props.workflowCreationInProgress && (
        <ModalFormDialog tag="div">
          <WorkflowCreateForm
            onSubmit={props.workflowActions.createWorkflowForProject}
            onCancel={props.hideCreateWorkflow}
            onSuccess={props.handleWorkflowCreation}
            projectID={props.project.id}
            workflowActiveStatus={!props.project.live}
          />
        </ModalFormDialog>
      )}

      {props.workflows.length > 0 && (
        <Paginator
          className="talk"
          page={meta.page}
          onPageChange={props.onPageChange}
          pageCount={meta.page_count}
        />
      )}

    </div>
  );
};

WorkflowsPage.defaultProps = {
  labPath: () => {},
  workflows: [],
  workflowActions: {
    createWorkflowForProject: () => {}
  }
};

WorkflowsPage.propTypes = {
  hideCreateWorkflow: React.PropTypes.func,
  handleWorkflowCreation: React.PropTypes.func,
  handleWorkflowReorder: React.PropTypes.func,
  labPath: React.PropTypes.func,
  loading: React.PropTypes.bool,
  onPageChange: React.PropTypes.func,
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    id: React.PropTypes.string,
    live: React.PropTypes.bool
  }),
  showCreateWorkflow: React.PropTypes.func,
  workflows: React.PropTypes.arrayOf(React.PropTypes.object),
  workflowActions: React.PropTypes.shape({
    createWorkflowForProject: React.PropTypes.func
  }),
  workflowCreationInProgress: React.PropTypes.bool
};

export default WorkflowsPage;
