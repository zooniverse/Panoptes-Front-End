import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import DragReorderable from 'drag-reorderable';
import ModalFormDialog from 'modal-form/dialog';
import WorkflowCreateForm from './workflow-create-form';
import LoadingIndicator from '../../components/loading-indicator';
import Paginator from '../../talk/lib/paginator';
import WorkflowsTable from './workflows-table';

const WorkflowsPage = (props) => {
  const reorderButton = props.reorder ?
    <button type="button" data-button="reorderWorkflow" onClick={props.toggleReorder}>Table view</button> :
    <button type="button" data-button="reorderWorkflow" onClick={props.toggleReorder}>Reorder view</button>;

  const meta = props.workflows.length ? props.workflows[0].getMeta() : {};

  const renderWorkflowList = ((workflow) => {
    return (
      <li key={workflow.id}>
        <Link key={workflow.id} to={props.labPath(`/workflows/${workflow.id}`)} className="nav-list-item" activeClassName="active">
          {workflow.display_name}
          {' '}(#{workflow.id})
          {(props.project.configuration && workflow.id === props.project.configuration.default_workflow) && (
            <span title="Default workflow">{' '}*{' '}</span>
          )}
        </Link>
      </li>
    );
  });

  return (
    <div>
      <h1 className="form-label">Workflows</h1>

      <p>A workflow is the sequence of tasks that you’re asking volunteers to perform.</p>
      <p>An asterisk (*) denotes a default workflow.</p>
      <p>If you have multiple workflows you can rearrange the order in which they are listed on your project's front page by clicking the reorder view button and then clicking and dragging on the left gray tab next to each workflow title listed below.</p>
      <p><em>Note</em>: Please leave at least one active workflow; even if all workflows are 100% complete.</p>
      <p>{reorderButton}</p>

      {props.reorder &&
        <DragReorderable
          tag="ul"
          className="nav-list"
          items={props.workflows}
          render={renderWorkflowList}
          onChange={props.handleWorkflowReorder}
        />}

      {(!props.reorder && props.workflows.length > 0) &&
        <div>
          <WorkflowsTable meta={meta} {...props} />
          <Paginator
            page={meta.page}
            onPageChange={props.onPageChange}
            pageCount={meta.page_count}
          />
        </div>}

      {(props.workflows.length === 0 && props.loading === false) && (
        <p>No workflows are currently associated with this project.</p>
      )}
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
      <hr />
      <p className="form-label">Status</p>
      <p className="form-help">In a live project active workflows are available to volunteers and cannot be edited. Inactive workflows can be edited if a project is live or in development.</p>
      <p className="form-help">If an active workflow is the default workflow for the project and is made inactive, then it will be removed as the default workflow.</p>
      <p className="form-label">Completeness statistic</p>
      <p className="form-help">Use this option to change how each workflow's completeness is calculated on the public statistics page.</p>
      <p className="form-help">
        When using "Classification Count" the completeness will increase after each classification. The
        {' '}total number of classifications needed to complete the workflow is estimated assuming a constant retirement limit.
        {' '}If the retirement limit is changed and/or subjects sets are unlinked from a <b>live</b> workflow this estimate will be inaccurate.
        {' '}To avoid these issues completed subject sets should not be removed, instead completed workflows should be deactivated
        {' '}and new ones created for new subject sets (note: workflows can be copied using the <i className="fa fa-copy" /> button at the top of a workflow's edit page).
      </p>
      <p className="form-help">
        When using "Retirement Count" the completeness will increase after each image retires (note: this value is re-calculated once an hour).
        {' '}Since the images are shown to users in a random order, this completeness estimate will be slow to increase until the project is close to being finished.
        {' '}If your project does not have a constant retirement limit (e.g. it uses a custom retiment rule) and/or subject sets
        {' '}have been unlinked from a live workflow, this estimate will be the most accurate.
      </p>
      <p className="form-label">Statistics Visibility</p>
      <p className="form-help">
        Active workflows are visible on the project's statistics page by default, and inactive projects are hidden by default. If there is a reason to hide an active workflow from the statistics page, such as a workflow being used in an a/b split experiment, or a reason to show an inactive workflow, then toggle the "Show on Stats Page" checkbox.
      </p>
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
