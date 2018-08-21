import PropTypes from 'prop-types';
import React from 'react';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

export default class WorkflowsContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      reorder: false,
      workflowCreationInProgress: false,
      workflows: []
    };
    this.handleSetStatsCompletenessType = this.handleSetStatsCompletenessType.bind(this);
    this.handleWorkflowCreation = this.handleWorkflowCreation.bind(this);
    this.handleWorkflowReorder = this.handleWorkflowReorder.bind(this);
    this.handleWorkflowStatusChange = this.handleWorkflowStatusChange.bind(this);
    this.handleWorkflowStatsVisibility = this.handleWorkflowStatsVisibility.bind(this);
    this.hideCreateWorkflow = this.hideCreateWorkflow.bind(this);
    this.labPath = this.labPath.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
    this.toggleReorder = this.toggleReorder.bind(this);

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
      getWorkflowsInOrder(this.props.project, { fields: 'display_name' })
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

  handleSetStatsCompletenessType(e, page, workflow) {
    workflow.update({ 'configuration.stats_completeness_type': e.target.value }).save()
      .catch(error => console.log(error))
      .then(() => this.getWorkflowList(page));
  }

  handleWorkflowStatusChange(e, page, workflow) {
    const defaultWorkflow = (this.props.project && this.props.project.configuration && this.props.project.configuration.default_workflow) ?
      this.props.project.configuration.default_workflow : null;
    const checked = e.target.checked;
    workflow.update({ active: checked }).save()
      .then((workflow) => {
        this.props.project.uncache();
        if (!workflow.active && workflow.id === defaultWorkflow) {
          this.props.project.update({ 'configuration.default_workflow': null }).save();
        }
      })
      .then(() => this.getWorkflowList(page))
      .catch(error => console.log(error));
  }

  handleWorkflowStatsVisibility(e, page, workflow) {
    const hidden = !e.target.checked;
    workflow.update({ 'configuration.stats_hidden': hidden }).save()
      .catch(error => console.log(error))
      .then(() => this.getWorkflowList(page));
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
    this.setState((prevState) => {
      return { reorder: !prevState.reorder };
    }, this.getWorkflowList);
  }

  render() {
    const hookProps = {
      hideCreateWorkflow: this.hideCreateWorkflow,
      handleSetStatsCompletenessType: this.handleSetStatsCompletenessType,
      handleWorkflowStatsVisibility: this.handleWorkflowStatsVisibility,
      handleWorkflowCreation: this.handleWorkflowCreation,
      handleWorkflowReorder: this.handleWorkflowReorder,
      handleWorkflowStatusChange: this.handleWorkflowStatusChange,
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
  router: PropTypes.object.isRequired
};

WorkflowsContainer.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object
  }),
  project: PropTypes.shape({
    get: PropTypes.func,
    id: PropTypes.string,
    links: PropTypes.shape({
      workflows: PropTypes.arrayOf(PropTypes.string)
    }),
    save: PropTypes.func,
    uncacheLink: PropTypes.func,
    update: PropTypes.func
  })
};
