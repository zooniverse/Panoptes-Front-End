import React from 'react';
import { Link } from 'react-router';


export default class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props)

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  handleWorkflowSelection() {
    this.props.onChangePreferences({ 'preferences.selected_workflow': this.props.workflow.id });
  }

  render() {
    return (
      <Link
        to={`projects/${this.props.project.slug}/classify`}
        className="call-to-action standard-button"
        onClick={this.handleWorkflowSelection}
        disabled={this.props.disabledLevel}
      >
        {(this.props.workflowAssignment) ? `You've unlocked level ${this.props.workflow.display_name}` : this.props.workflow.display_name}
      </Link>
    );
  }
}

ProjectHomeWorkflowButton.defaultProps = {
  disabledLevel: false,
  onChangePreferences: () => {},
  project: {},
  workflow: {},
  workflowAssignment: false,
}

ProjectHomeWorkflowButton.propTypes = {
  disabledLevel: React.PropTypes.bool,
  onChangePreferences: React.PropTypes.func.isRequired,
  project: React.PropTypes.shape({
    slug: React.PropTypes.string,
  }).isRequired,
  workflow: React.PropTypes.object.isRequired,
  workflowAssignment: React.PropTypes.bool,
};