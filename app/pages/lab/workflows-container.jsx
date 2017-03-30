import React from 'react';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';
import WorkflowsPage from './workflows';

export default class WorkflowsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      workflowCreationInProgress: false,
      workflows: []
    };

    this.labPath = this.labPath.bind(this);
    this.handleWorkflowCreation = this.handleWorkflowCreation.bind(this);
    this.hideCreateWorkflow = this.hideCreateWorkflow.bind(this);
    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
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

  render() {
    const hookProps = {
      hideCreateWorkflow: this.hideCreateWorkflow,
      handleWorkflowCreation: this.handleWorkflowCreation,
      handleWorkflowReorder: this.handleWorkflowReorder,
      onPageChange: this.onPageChange,
      showCreateWorkflow: this.showCreateWorkflow,
      labPath: this.labPath
    };

    return (
      <WorkflowsPage {...this.props} {...hookProps} {...this.state} />
    );
  }
}

WorkflowsContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

WorkflowsContainer.defaultProps = {
  project: {
    configuration: {}
  }
};

WorkflowsContainer.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
    query: React.PropTypes.object
  }),
  project: React.PropTypes.shape({
    id: React.PropTypes.string,
    save: React.PropTypes.func,
    uncacheLink: React.PropTypes.func,
    update: React.PropTypes.func
  })
};
