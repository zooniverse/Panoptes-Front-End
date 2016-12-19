import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';


export default class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  handleWorkflowSelection(e) {
    if (this.props.disabled) {
      e.preventDefault();
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
      'call-to-action-button--disabled': this.props.disabled,
    });

    if (this.props.disabled) {
      return (
        <span className={linkClasses}>
          {this.props.workflow.display_name}
        </span>
      );
    }

    if (this.props.workflowAssignment &&
        this.props.workflow.configuration &&
        !this.props.workflow.configuration.level) {
      return (null);
    }

    return (
      <Link
        to={`/projects/${this.props.project.slug}/classify`}
        className={linkClasses}
        onClick={this.handleWorkflowSelection}
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
};

ProjectHomeWorkflowButton.propTypes = {
  disabled: React.PropTypes.bool,
  onChangePreferences: React.PropTypes.func.isRequired,
  project: React.PropTypes.shape({
    slug: React.PropTypes.string,
  }).isRequired,
  workflow: React.PropTypes.shape({
    configuration: React.PropTypes.shape({
      level: React.PropTypes.string,
    }),
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
  }).isRequired,
  workflowAssignment: React.PropTypes.bool,
};
