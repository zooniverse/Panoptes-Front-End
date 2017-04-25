import React from 'react';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

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
    this.handleWorkflowReorder = this.handleWorkflowReorder.bind(this);
  }

  componentDidMount() {
    this.getWorkflowList();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.getWorkflowList();
    }
  }

  getWorkflowList() {
    getWorkflowsInOrder(this.props.project, { fields: 'display_name' })
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
    const newLocation = Object.assign({}, this.props.location, { pathname: `/lab/${this.props.project.id}/workflows/${workflow.id}` });
    this.context.router.push(newLocation);
    this.props.project.uncacheLink('workflows');
    this.props.project.uncacheLink('subject_sets'); // An "expert" subject set is automatically created with each workflow.
  }

  render() {
    const hookProps = {
      hideCreateWorkflow: this.hideCreateWorkflow,
      handleWorkflowCreation: this.handleWorkflowCreation,
      handleWorkflowReorder: this.handleWorkflowReorder,
      showCreateWorkflow: this.showCreateWorkflow,
      labPath: this.labPath
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
    id: React.PropTypes.string,
    save: React.PropTypes.func,
    uncacheLink: React.PropTypes.func,
    update: React.PropTypes.func
  })
};
