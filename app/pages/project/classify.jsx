import apiClient from 'panoptes-client/lib/api-client';

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import counterpart from 'counterpart';
import { Split } from 'seven-ten';

import ClassificationQueue from '../../lib/classification-queue';

import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';

import Classifier from '../../classifier';
import FinishedBanner from './finished-banner';
import WorkflowAssignmentDialog from '../../components/workflow-assignment-dialog';
import ProjectThemeButton from './components/ProjectThemeButton';
import WorkflowSelection from './workflow-selection';
import { zooTheme } from '../../theme';

function onClassificationSaved(actualClassification) {
  Split.classificationCreated(actualClassification); // Metric log needs classification id
}

function isPresent(val) {
  return val !== undefined && val !== null;
}

const classificationQueue = new ClassificationQueue(apiClient, onClassificationSaved);

// Store this externally to persist during the session.
let sessionDemoMode = false;

export class ProjectClassifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.project = null;
    this.workflow = null;

    this.state = {
      projectIsComplete: false,
      demoMode: sessionDemoMode,
      promptWorkflowAssignmentDialog: false,
      rejected: null,
      validUserGroup: false
    };
  }

  componentDidMount() {
    Split.classifierVisited();
    if (this.props.workflow) {
      this.loadAppropriateClassification();
    }

    this.validateUserGroup(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.user !== null) {
      this.shouldWorkflowAssignmentPrompt(nextProps, nextContext);
    }

    const currentGroup = this.props.location.query && this.props.location.query.group;
    const nextGroup = nextProps.location.query && nextProps.location.query.group;

    if (nextGroup !== currentGroup || nextProps.user !== this.props.user) {
      this.validateUserGroup(nextProps);
    }

    if (nextProps.user === null && nextContext.initialLoadComplete) {
      this.clearUserGroupForClassification(nextProps, nextContext);
    }
  }

  componentWillUpdate(nextProps) {
    const nextWorkflowID = (isPresent(nextProps) && isPresent(nextProps.workflow)) ? nextProps.workflow : null;
    this.context.geordi.remember({ workflowID: nextWorkflowID });
  }

  componentDidUpdate(prevProps) {
    const { actions, classification, project, upcomingSubjects, workflow } = this.props;

    if (workflow !== prevProps.workflow) {
      this.loadAppropriateClassification();
    }

    if (upcomingSubjects.length !== prevProps.upcomingSubjects.length) {
      // Refill the subject queue when we're down to the last subject in the current batch.
      if (upcomingSubjects.length < 2) {
        this.refillSubjectQueue();
      }
    }

    if (workflow &&
      classification !== prevProps.classification
    ) {
      if (classification) {
        // we've just started a new classification.
        if (this.state.validUserGroup) {
          classification.update({ 'metadata.selected_user_group_id': this.props.location.query.group });
        }
      }
    }
  }

  componentWillUnmount() {
    if (isPresent(this.context.geordi)) {
      this.context.geordi.forget(['workflowID']);
    }
  }

  refillSubjectQueue() {
    const { actions, project, workflow } = this.props;

    this.maybePromptWorkflowAssignmentDialog(this.props);
    actions.classifier.fetchSubjects(workflow)
    .then(() => actions.classifier.createClassification(project, workflow))
    .catch((error) => {
      this.setState({ rejected: { classification: error }});
    });
  }

  loadAppropriateClassification() {
    const { actions, classification, workflow } = this.props;
    // Check if we're resuming an existing classification
    // or starting a new classifying session
    // and act accordingly
    if (this.state.rejected && this.state.rejected.classification) {
      this.setState({ rejected: null });
    }

    if (classification && classification.links.workflow === workflow.id) {
     // Resume an existing workflow session with a valid classification
      actions.classifier.resumeClassification(classification);
    } else if (classification) {
    // Empty the queue and restart if we've changed workflows since the last classification was created.
      actions.classifier.emptySubjectQueue();
    } else {
    // There's no existing classification so refill the queue and generate a new classification.
      this.refillSubjectQueue();
    }
  }

  shouldWorkflowAssignmentPrompt(nextProps) {
    // Only for Gravity Spy which is assigning workflows to logged in users
    if (nextProps.project.experimental_tools.indexOf('workflow assignment') > -1) {
      const assignedWorkflowID = nextProps.preferences &&
        nextProps.preferences.settings &&
        nextProps.preferences.settings.workflow_id;
      const currentWorkflowID = this.props.preferences && this.props.preferences.preferences.selected_workflow;
      if (assignedWorkflowID && currentWorkflowID && assignedWorkflowID !== currentWorkflowID) {
        if (this.state.promptWorkflowAssignmentDialog === false) {
          this.setState({ promptWorkflowAssignmentDialog: true });
        }
      }
    }
  }

  handleDemoModeChange(newDemoMode) {
    sessionDemoMode = newDemoMode;
    this.setState({ demoMode: sessionDemoMode });
  }

  saveClassification() {
    if (this.context.geordi) {
      this.context.geordi.logEvent({ type: 'classify' });
    }

    const { classification } = this.props;
    console.info('Completed classification', classification);

    if (!this.state.demoMode) {
      classificationQueue.add(classification);
    }
    return Promise.resolve(classification);
  }

  loadAnotherSubject() {
    const { actions, project, workflow } = this.props;
    if (workflow) {
      actions.classifier.nextSubject(project, workflow);
    }
  }

  maybePromptWorkflowAssignmentDialog(props) {
    const { actions, preferences, project, splits, translations } = props;
    if (this.state.promptWorkflowAssignmentDialog) {
      WorkflowAssignmentDialog.start({ splits, project }).then(() =>
        this.setState({ promptWorkflowAssignmentDialog: false })
      ).then(() => {
        if (preferences.preferences.selected_workflow !== preferences.settings.workflow_id) {
          preferences.update({ 'preferences.selected_workflow': preferences.settings.workflow_id });
          preferences.save();
          apiClient
            .type('workflows')
            .get(preferences.settings.workflow_id, {})
            .then((newWorkflow) => {
              actions.translations.load('workflow', newWorkflow.id, translations.locale);
              actions.classifier.setWorkflow(newWorkflow);
            });
        }
      });
    }
  }

  validateUserGroup(props, context) {
    if (props.location.query && props.location.query.group && props.user) {
      apiClient.type('user_groups').get(props.location.query.group).then((group) => {
        const isUserMemberOfGroup = group.links && group.links.users && group.links.users.includes(props.user.id);
        this.setState({ validUserGroup: group && isUserMemberOfGroup });

        if (!isUserMemberOfGroup || !group) {
          this.clearUserGroupForClassification(props, context);
        }
      }).catch((error) => {
        if (error.status === 404) {
          this.clearUserGroupForClassification(props, context);
        }
      });
    }
  }

  clearUserGroupForClassification(props, context) {
    if (props.location.query && props.location.query.group) {
      const query = props.location.query;
      this.setState({ validUserGroup: false });

      Object.keys(query).forEach((key) => {
        if (key === 'group') { delete query[key]; }
      });

      const newLocation = Object.assign({}, props.location, { query });
      newLocation.search = '';
      context.router.push(newLocation);
    }
  }

  renderClassifier() {
    const { classification, upcomingSubjects, workflow } = this.props;
    const { demoMode } = this.state;
    const subject = upcomingSubjects[0];
    if (classification && classification.links.workflow === workflow.id) {
      return (
        <Classifier
          key={classification.links.workflow}
          {...this.props}
          classification={classification}
          subject={subject}
          demoMode={demoMode}
          onChangeDemoMode={this.handleDemoModeChange.bind(this)}
          onComplete={this.saveClassification.bind(this)}
          onClickNext={this.loadAnotherSubject.bind(this)}
          requestUserProjectPreferences={this.props.requestUserProjectPreferences}
          splits={this.props.splits}
        />
      );
    } else if (this.state.rejected && this.state.rejected.classification) {
      return (
        <code>Please try again. Something went wrong: {this.state.rejected.classification.toString()}</code>
      );
    } else {
      return (
        <span>Loading classification</span>
      );
    }
  }

  render() {
    return (
      <WorkflowSelection
        actions={this.props.actions}
        location={this.props.location}
        preferences={this.props.preferences}
        project={this.props.project}
        projectRoles={this.props.projectRoles}
        translations={this.props.translations}
        user={this.props.user}
      >
        <div
          className={`${(this.props.theme === zooTheme.mode.light) ? 'classify-page' : 'classify-page classify-page--dark-theme'}`}
        >
          <Helmet title={`${this.props.project.display_name} » ${counterpart('project.classifyPage.title')}`} />

          {this.props.projectIsComplete &&
            <FinishedBanner project={this.props.project} />}

          {this.state.validUserGroup &&
            <p className="anouncement-banner--group">You are classifying as a student of your classroom.</p>}

          {this.props.workflow ? this.renderClassifier() : <p>Loading workflow</p>}
          <ProjectThemeButton />
        </div>
      </WorkflowSelection>
    );
  }
}

ProjectClassifyPage.contextTypes = {
  geordi: PropTypes.object,
  initialLoadComplete: PropTypes.bool,
  router: PropTypes.object
};

ProjectClassifyPage.propTypes = {
  actions: PropTypes.shape({
    classifier: PropTypes.shape({
      createClassification: PropTypes.func,
      emptySubjectQueue: PropTypes.func,
      fetchSubjects: PropTypes.func,
      nextSubject: PropTypes.func,
      refillSubjectQueue: PropTypes.func
    }),
    translations: PropTypes.shape({
      load: PropTypes.func
    })
  }),
  classification: PropTypes.shape({}),
  loadingSelectedWorkflow: PropTypes.bool,
  location: PropTypes.shape({
    query: PropTypes.shape({
      group: PropTypes.string
    })
  }),
  preferences: PropTypes.shape({
    preferences: PropTypes.shape({
      selected_workflow: PropTypes.string
    })
  }),
  project: PropTypes.object,
  storage: PropTypes.object,
  translations: PropTypes.shape({
    locale: PropTypes.string
  }),
  upcomingSubjects: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  workflow: PropTypes.object
};

ProjectClassifyPage.defaultProps = {
  classification: null,
  location: {
    query: {}
  },
  upcomingSubjects: []
};

window.classificationQueue = classificationQueue;

const mapStateToProps = state => ({
  classification: state.classify.classification,
  translations: state.translations,
  upcomingSubjects: state.classify.upcomingSubjects,
  theme: state.userInterface.theme,
  workflow: state.classify.workflow
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classifier: bindActionCreators(classifierActions, dispatch),
    translations: bindActionCreators(translationActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectClassifyPage);
