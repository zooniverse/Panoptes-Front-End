import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Translate from 'react-translate-component';
import apiClient from 'panoptes-client/lib/api-client';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classifierActions from '../../../redux/ducks/classify';
import * as translationActions from '../../../redux/ducks/translations';

class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  handleWorkflowSelection(e) {
    const { actions, disabled, preferences, user, translations, workflow } = this.props;
    if (disabled) {
      e.preventDefault();
    } else {
      actions.classifier.setWorkflow(null);
      return apiClient
        .type('workflows')
        .get(workflow.id, {})
        .then((newWorkflow) => {
          if (user) {
            preferences.update({ 'preferences.selected_workflow': newWorkflow.id }).save();
          }
          actions.translations.load('workflow', newWorkflow.id, translations.locale);
          actions.classifier.setWorkflow(newWorkflow);
        });
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
  actions: {
    classifier: {
      setWorkflow: () => null
    },
    translations: {
      load: () => null
    }
  },
  disabled: false,
  preferences: {},
  project: {},
  workflow: {},
  workflowAssignment: false
};

ProjectHomeWorkflowButton.propTypes = {
  actions: PropTypes.shape({
    classifier: PropTypes.shape({
      setWorkflow: PropTypes.func
    }),
    translations: PropTypes.shape({
      load: PropTypes.func
    })
  }),
  disabled: PropTypes.bool,
  preferences: PropTypes.shape({
    update: PropTypes.func
  }),
  project: PropTypes.shape({
    slug: PropTypes.string
  }).isRequired,
  translations: PropTypes.shape({
    locale: PropTypes.string
  }),
  workflow: PropTypes.shape({
    configuration: PropTypes.shape({
      level: PropTypes.string
    }),
    display_name: PropTypes.string,
    id: PropTypes.string
  }).isRequired,
  workflowAssignment: PropTypes.bool
};

const mapStateToProps = state => ({
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classifier: bindActionCreators(classifierActions, dispatch),
    translations: bindActionCreators(translationActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectHomeWorkflowButton);
export { ProjectHomeWorkflowButton };

