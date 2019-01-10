import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import classnames from 'classnames';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classifierActions from '../../../redux/ducks/classify';
import * as translationActions from '../../../redux/ducks/translations';

class ProjectHomeWorkflowButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleWorkflowSelection = this.handleWorkflowSelection.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { classifierWorkflow, project, workflow } = this.props;
    const classifierWorkflowID = classifierWorkflow && classifierWorkflow.id;
    const prevClassifierWorkflowID = prevProps.classifierWorkflow && prevProps.classifierWorkflow.id;
    const classifierWorkflowChanged = classifierWorkflowID !== prevClassifierWorkflowID;
    if (classifierWorkflowChanged && classifierWorkflowID === workflow.id) {
      browserHistory.push(`/projects/${project.slug}/classify`);
    }
  }

  handleWorkflowSelection(e) {
    const { actions, classifierWorkflow, project, preferences, translations, workflow } = this.props;
    if (classifierWorkflow && classifierWorkflow.id === workflow.id) {
      browserHistory.push(`/projects/${project.slug}/classify`);
    } else {
      actions.classifier.loadWorkflow(workflow.id, translations.locale, preferences);
    }
  }

  render() {
    // To disable the anchor tag, use class to set pointer-events: none style.
    // Except IE, which supports a disabled attribute instead.
    const buttonClasses = classnames({
      'project-home-page__button': true,
      'project-home-page__button--disabled': this.props.disabled
    });

    if (this.props.workflowAssignment &&
        this.props.workflow.configuration &&
        !this.props.workflow.configuration.level) {
      return (null);
    }

    return (
      <button
        disabled={this.props.disabled}
        type="button"
        className={buttonClasses}
        onClick={this.handleWorkflowSelection}
      >
        {(this.props.workflowAssignment && !this.props.disabled) ?
          <Translate content="project.home.workflowAssignment" with={{ workflowDisplayName: this.props.workflow.display_name }} /> :
          this.props.workflow.display_name}
      </button>
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
  classifierWorkflow: state.classify.workflow,
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

