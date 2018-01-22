import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import DragReorderable from 'drag-reorderable';
import ModalFormDialog from 'modal-form/dialog';
import WorkflowCreateForm from './workflow-create-form';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';

const WorkflowsPage = (props) => {
  const renderWorkflow = ((workflow) => {
    let progressPercentage = workflow.completeness * 100;
    return (
      <li key={workflow.id}>
        <Link key={workflow.id} to={props.labPath(`/workflows/${workflow.id}`)} className="nav-list-item" activeClassName="active">
          {workflow.display_name}{' -- '}{`${progressPercentage.toFixed(0)} % Complete`}
          {(props.project.configuration && workflow.id === props.project.configuration.default_workflow) && (
            <span title="Default workflow">{' '}*{' '}</span>
          )}
        </Link>
      </li>
    );
  });

  const reorderButton = props.reorder ?
    <button type="button" data-button="reorderWorkflow" onClick={props.toggleReorder}>List view</button> :
    <button type="button" data-button="reorderWorkflow" onClick={props.toggleReorder}>Reorder view</button>;
  const meta = props.workflows.length ? props.workflows[0].getMeta() : {};

  return (
    <div>
      <h1 className="form-label">Workflows</h1>

      <p>A workflow is the sequence of tasks that you’re asking volunteers to perform.</p>
      <p>An asterisk (*) denotes a default workflow.</p>
      <p>If you have multiple workflows you can rearrange the order in which they are listed on your project's front page by clicking the reorder view button and then clicking and dragging on the left gray tab next to each workflow title listed below.</p>
      <p>NOTE: Please leave at least one active workflow; even if all workflows are 100% complete.</p>
      <p>{reorderButton}</p>

      {props.reorder &&
        <DragReorderable tag="ul" className="nav-list" items={props.workflows} render={renderWorkflow} onChange={props.handleWorkflowReorder} />}

      {(!props.reorder && props.workflows.length > 0) &&
        <div>
          <ul className="nav-list">
            {props.workflows.map(workflow => renderWorkflow(workflow))}
          </ul>
          <hr />
          <Paginator
            page={meta.page}
            onPageChange={props.onPageChange}
            pageCount={meta.page_count}
          />
        </div>}

      {(props.workflows.length === 0 && props.loading === false) && (
        <p>No workflows are currently associated with this project.</p>
      )}

      <hr />

      <div>
        <button
          type="button"
          data-button="createWorkflow"
          onClick={props.showCreateWorkflow}
          disabled={props.workflowCreationInProgress}
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
  hideCreateWorkflow: PropTypes.func,
  handleWorkflowCreation: PropTypes.func,
  handleWorkflowReorder: PropTypes.func,
  labPath: PropTypes.func,
  loading: PropTypes.bool,
  onPageChange: PropTypes.func,
  project: PropTypes.shape({
    configuration: PropTypes.object,
    id: PropTypes.string,
    live: PropTypes.bool
  }),
  reorder: PropTypes.bool,
  showCreateWorkflow: PropTypes.func,
  toggleReorder: PropTypes.func,
  workflows: PropTypes.arrayOf(PropTypes.object),
  workflowActions: PropTypes.shape({
    createWorkflowForProject: PropTypes.func
  }),
  workflowCreationInProgress: PropTypes.bool
};

export default WorkflowsPage;
