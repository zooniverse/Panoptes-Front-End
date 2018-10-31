import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Translate from 'react-translate-component';

export default class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  handleWorkflowSelection(e) {
    if (this.props.disabled) {
      e.preventDefault();
    } else {
      this.props.preferences.update({ 'preferences.selected_workflow': this.props.workflow.id });
    }
  }

  render() {
    // To disable the anchor tag, use class to set pointer-events: none style.
    // Except IE, which supports a disabled attribute instead.
    const linkClasses = classnames({
      'project-home-page__button': true,
      'project-home-page__button--disabled': this.props.disabled
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
        {(this.props.workflowAssignment && !this.props.disabled) ?
          <Translate content="project.home.workflowAssignment" with={{ workflowDisplayName: this.props.workflow.display_name }} /> :
          this.props.workflow.display_name}
      </Link>
    );
  }
}

ProjectHomeWorkflowButton.defaultProps = {
  disabled: false,
  preferences: {},
  project: {},
  workflow: {},
  workflowAssignment: false
};

ProjectHomeWorkflowButton.propTypes = {
  disabled: PropTypes.bool,
  preferences: PropTypes.shape({
    update: PropTypes.func
  }),
  project: PropTypes.shape({
    slug: PropTypes.string
  }).isRequired,
  workflow: PropTypes.shape({
    configuration: PropTypes.shape({
      level: PropTypes.string
    }),
    display_name: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
  workflowAssignment: PropTypes.bool
};