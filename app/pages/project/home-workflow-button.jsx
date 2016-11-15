import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';


export default class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props)

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  handleWorkflowSelection(e) {
    if (this.props.disabled) {
      e.preventDefault()
    } else {
      this.props.onChangePreferences('preferences.selected_workflow', this.props.workflow.id);
    }
  }

  render() {
    // To disable the anchor tag, use class to set pointer-events: none style. 
    // Except IE, which supports a disabled attribute instead. 
    const linkClasses = classnames({
      'call-to-action': true,
      'standard-button': true,
      'call-to-action-button--disabled': this.props.disabled
    });

    return (
      <Link
        to={`/projects/${this.props.project.slug}/classify`}
        className={linkClasses}
        onClick={this.handleWorkflowSelection}
        disabled={this.props.disabled}
        ariaDisabled={this.props.disabled}
      >
        {(this.props.workflowAssignment && !this.props.disabled) ? `You've unlocked level ${this.props.workflow.display_name}` : this.props.workflow.display_name}
      </Link>
    );
  }
}

ProjectHomeWorkflowButton.defaultProps = {
  disabled: false,
  onChangePreferences: () => {},
  project: {},
  workflow: {},
  workflowAssignment: false,
}

ProjectHomeWorkflowButton.propTypes = {
  disabled: React.PropTypes.bool,
  onChangePreferences: React.PropTypes.func.isRequired,
  project: React.PropTypes.shape({
    slug: React.PropTypes.string,
  }).isRequired,
  workflow: React.PropTypes.object.isRequired,
  workflowAssignment: React.PropTypes.bool,
};