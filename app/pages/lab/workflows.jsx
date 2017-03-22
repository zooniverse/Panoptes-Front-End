import React from 'react';
import { Link } from 'react-router';
import DragReorderable from 'drag-reorderable';
import LoadingIndicator from '../../components/loading-indicator';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

export default class WorkflowsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workflowCreationInProgress: false,
      workflows: []
    };

    this.showCreateWorkflow = this.showCreateWorkflow.bind(this);
  }

  componentWillMount() {
    getWorkflowsInOrder(this.props.project, { fields: 'display_name' })
    .then((workflows) => {
      this.setState({ workflows });
    });
  }

  labPath(postFix = '') {
    return `/lab/${this.props.project.id}${postFix}`;
  }

  showCreateWorkflow() {
    this.setState({ workflowCreationInProgress: true });
  }

  render() {
    return (
      <div>
        <div className="nav-list-header">Workflows</div>

        {this.state.workflows.map((workflow) => {
          return (
            <Link to={this.labPath(`/workflow/${workflow.id}`)} className="nav-list-item" activeClassName="active">
              {workflow.display_name}
              {workflow.id === this.props.project.configuration.default_workflow && (
                <span title="Default workflow">{' '}*{' '}</span>
              )}
            </Link>
          );
        })}

        <div className="nav-list-item">
          <button type="button" onClick={this.showCreateWorkflow} disabled={this.state.workflowCreationInProgress} title="A workflow is the sequence of tasks that you’re asking volunteers to perform.">
            New workflow{' '}
            <LoadingIndicator off={!this.state.workflowCreationInProgress} />
          </button>
        </div>

      </div>
    );
  }
}

WorkflowsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

WorkflowsPage.defaultProps = {
  project: {}
};

WorkflowsPage.propTypes = {
  project: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    id: React.PropTypes.string
  })
};
