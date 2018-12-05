import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory, Link } from 'react-router';
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

  componentDidUpdate() {
    const { classifierWorkflow, project, workflow } = this.props;
    if (classifierWorkflow && classifierWorkflow.id === workflow.id) {
      browserHistory.push(`/projects/${project.slug}/classify`);
    }
  }

  handleWorkflowSelection(e) {
    const { actions, preferences, translations, workflow } = this.props;
    e.preventDefault();
    actions.classifier.loadWorkflow(workflow.id, translations.locale, preferences);
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

