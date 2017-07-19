import React from 'react';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

export default class WorkflowsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reorder: false,
      workflowCreationInProgress: false,
      workflows: []
    };

    this.labPath = this.labPath.bind(this);
    this.handleWorkflowCreation = this.handleWorkflowCreation.bind(this);
    this.hideCreateWorkflow = this.hideCreateWorkflow.bind(this);
    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
    this.handleWorkflowReorder = this.handleWorkflowReorder.bind(this);
    this.toggleReorder = this.toggleReorder.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    const page = (this.props.location && this.props.location.query) ? this.props.location.query.page : 1;
    this.getWorkflowList(page);
  }

  onPageChange(page) {
    const nextQuery = Object.assign({}, this.props.location.query, { page });
    this.context.router.push({
      pathname: this.props.location.pathname,
      query: nextQuery
    });
    this.getWorkflowList(page);
  }

  getWorkflowList(page) {
    if (this.state.reorder) {
      this.context.router.push({ pathname: this.props.location.pathname, query: null });
      getWorkflowsInOrder(this.props.project, { fields: 'display_name', page_size: this.props.project.links.workflows.length })
      .then((workflows) => {
        this.setState({ workflows, loading: false });
      });
    } else {
      this.props.project.get('workflows', { page })
        .then((workflows) => {
          this.setState({ workflows, loading: false });
        });
    }
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
    const newLocation = Object.assign({}, this.props.location, { pathname: `/lab/${this.props.project.id}/workflows/${workflow.id}` });
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    this.props.project.uncacheLink('subject_sets'); // An "expert" subject set is automatically created with each workflow.
    this.getWorkflowList();
  }

  toggleReorder() {
    this.setState((prevState) => { return { reorder: !prevState.reorder }; }, this.getWorkflowList);
  }

  render() {
    const hookProps = {
      hideCreateWorkflow: this.hideCreateWorkflow,
      handleWorkflowCreation: this.handleWorkflowCreation,
      handleWorkflowReorder: this.handleWorkflowReorder,
      showCreateWorkflow: this.showCreateWorkflow,
      labPath: this.labPath,
      onPageChange: this.onPageChange,
      toggleReorder: this.toggleReorder
    };

    const allProps = Object.assign({}, this.props, this.state, hookProps);

    return (
      <div>
        {React.cloneElement(this.props.children, allProps)}
      </div>
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
  children: React.PropTypes.node,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
    query: React.PropTypes.object
  }),
  project: React.PropTypes.shape({
    get: React.PropTypes.func,
    id: React.PropTypes.string,
    links: React.PropTypes.shape({
      workflows: React.PropTypes.arrayOf(React.PropTypes.string)
    }),
    save: React.PropTypes.func,
    uncacheLink: React.PropTypes.func,
    update: React.PropTypes.func
  })
};
