import React from 'react';
import { Link } from 'react-router';
import DragReorderable from 'drag-reorderable';
import ModalFormDialog from 'modal-form/dialog';
import Paginator from '../../talk/lib/paginator';
import WorkflowCreateForm from './workflow-create-form';
import LoadingIndicator from '../../components/loading-indicator';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

export default class WorkflowsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      workflowCreationInProgress: false,
      workflows: []
    };

    this.handleWorkflowCreation = this.handleWorkflowCreation.bind(this);
    this.hideCreateWorkflow = this.hideCreateWorkflow.bind(this);
    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.renderWorkflow = this.renderWorkflow.bind(this);
    this.handleWorkflowReorder = this.handleWorkflowReorder.bind(this);
  }

  componentDidMount() {
    const page = this.props.location.query.page || 1;
    this.getWorkflowList(page);
  }

  componentWillReceiveProps(nextProps) {
    const newPage = nextProps.location.query.page;
    if (newPage !== this.props.location.query.page) {
      this.getWorkflowList(newPage);
    }
  }

  onPageChange(page) {
    const nextQuery = Object.assign({}, this.props.location.query, { page });
    this.context.router.push({
      pathname: this.props.location.pathname,
      query: nextQuery
    });
  }

  getWorkflowList(page = 1) {
    getWorkflowsInOrder(this.props.project, { fields: 'display_name', page_size: 20, page })
    .then((workflows) => {
      this.setState({ workflows, loading: false });
    });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  showCreateWorkflow() {
    this.setState({ workflowCreationInProgress: true });
  }

  hideCreateWorkflow() {
    this.setState({ workflowCreationInProgress: false });
  }

  handleWorkflowReorder(newOrder) {
    const newOrderIDs = newOrder.map((workflow) => {
      return workflow.id;
    });
    this.props.project.update({
      'configuration.workflow_order': newOrderIDs
    });
    this.setState({ workflows: newOrder });
    this.props.project.save();
  }

  handleWorkflowCreation(workflow) {
    this.hideCreateWorkflow();
    const newLocation = Object.assign({}, this.props.location, { pathname: `/lab/${this.props.project.id}/workflow/${workflow.id}` });
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    this.props.project.uncacheLink('subject_sets'); // An "expert" subject set is automatically created with each workflow.
  }

  renderWorkflow(workflow) {
    return (
      <li key={workflow.id}>
        <Link key={workflow.id} to={this.labPath(`/workflow/${workflow.id}`)} className="nav-list-item" activeClassName="active">
          {workflow.display_name}
          {workflow.id === this.props.project.configuration.default_workflow && (
            <span title="Default workflow">{' '}*{' '}</span>
          )}
        </Link>
      </li>
    );
  }

  render() {
    const meta = this.state.workflows.length ? this.state.workflows[0].getMeta() : {};

    return (
      <div>
        <div className="form-label">Workflows</div>

        <DragReorderable tag="ul" className="nav-list" items={this.state.workflows} render={this.renderWorkflow} onChange={this.handleWorkflowReorder} />

        {(this.state.workflows.length === 0 && this.state.loading === false) && (
          <p>No workflows are currently associated with this project.</p>
        )}

        <div className="nav-list-item">
          <button
            type="button"
            onClick={this.showCreateWorkflow}
            disabled={this.state.workflowCreationInProgress}
            title="A workflow is the sequence of tasks that you’re asking volunteers to perform."
          >
            New workflow{' '}
            <LoadingIndicator off={!this.state.workflowCreationInProgress} />
          </button>
        </div>

        {this.state.workflowCreationInProgress && (
          <ModalFormDialog tag="div">
            <WorkflowCreateForm
              onSubmit={this.props.workflowActions.createWorkflowForProject}
              onCancel={this.hideCreateWorkflow}
              onSuccess={this.handleWorkflowCreation}
              projectID={this.props.project.id}
              workflowActiveStatus={!this.props.project.live}
            />
          </ModalFormDialog>
        )}

        {this.state.workflows.length > 0 && (
          <Paginator
            className="talk"
            page={meta.page}
            onPageChange={this.onPageChange}
            pageCount={meta.page_count}
          />
        )}

      </div>
    );
  }
}

WorkflowsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

WorkflowsPage.defaultProps = {
  project: {
    configuration: {}
  }
};

WorkflowsPage.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
    query: React.PropTypes.object
  }),
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    id: React.PropTypes.string,
    live: React.PropTypes.bool,
    save: React.PropTypes.func,
    uncacheLink: React.PropTypes.func,
    update: React.PropTypes.func
  }),
  workflowActions: React.PropTypes.shape({
    createWorkflowForProject: React.PropTypes.func
  })
};
