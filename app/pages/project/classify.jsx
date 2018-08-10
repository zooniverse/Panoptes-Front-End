import apiClient from 'panoptes-client/lib/api-client';
import auth from 'panoptes-client/lib/auth';

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import counterpart from 'counterpart';
import { Split } from 'seven-ten';

import seenThisSession from '../../lib/seen-this-session';
import ClassificationQueue from '../../lib/classification-queue';

import * as classifierActions from '../../redux/ducks/classify';

import Classifier from '../../classifier';
import FinishedBanner from './finished-banner';
import WorkflowAssignmentDialog from '../../components/workflow-assignment-dialog';
import ProjectThemeButton from './components/ProjectThemeButton';
import { zooTheme } from '../../theme';

// Map each project ID to a promise of its last randomly-selected workflow ID.
// This is to maintain the same random workflow for each project when none is specified by the user.
const currentWorkflowForProject = {};

function onClassificationSaved(actualClassification) {
  Split.classificationCreated(actualClassification); // Metric log needs classification id
}

function isPresent(val) {
  return val !== undefined && val !== null;
}

const classificationQueue = new ClassificationQueue(window.localStorage, apiClient, onClassificationSaved);

auth.listen('change', classifierActions.emptySubjectQueue);
apiClient.type('subject_sets').listen('add-or-remove', classifierActions.emptySubjectQueue);

// Store this externally to persist during the session.
let sessionDemoMode = false;

export class ProjectClassifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.loadingSelectedWorkflow = false;
    this.project = null;
    this.workflow = null;

    this.state = {
      classification: null,
      projectIsComplete: false,
      demoMode: sessionDemoMode,
      promptWorkflowAssignmentDialog: false,
      rejected: null,
      validUserGroup: false
    };
  }

  componentDidMount() {
    Split.classifierVisited();
    if (this.props.workflow && !this.props.loadingSelectedWorkflow) {
      this.loadAppropriateClassification();
    }

    this.validateUserGroup(this.props, this.context);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.loadingSelectedWorkflow === false && nextProps.user !== null) {
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
    const { actions, currentClassifications, project, workflow } = this.props;

    if (project !== prevProps.project) {
      this.loadAppropriateClassification();
    }

    if (!this.props.loadingSelectedWorkflow) {
      if (workflow !== prevProps.workflow) {
        // Clear out current classification
        if (prevProps.workflow) {
          actions.classifier.resetClassification(prevProps.workflow);
        }

        this.setState({ classification: null });
        this.loadAppropriateClassification();
      }
    }

    if (workflow &&
      currentClassifications.forWorkflow[workflow.id] !== prevProps.currentClassifications.forWorkflow[workflow.id]
    ) {
      const classification = currentClassifications.forWorkflow[workflow.id];
      if (this.state.validUserGroup) {
        classification.update({ 'metadata.selected_user_group_id': this.props.location.query.group });
      }
      this.setState({ classification });
    }
  }

  componentWillUnmount() {
    if (isPresent(this.context.geordi)) {
      this.context.geordi.forget(['workflowID']);
    }
  }

  getSubjectSet(workflow) {
    if (workflow.grouped) {
      return workflow.get('subject_sets').then((subjectSets) => {
        const randomIndex = Math.floor(Math.random() * subjectSets.length);
        return subjectSets[randomIndex];
      });
    } else {
      return Promise.resolve();
    }
  }

  getNextSubject(subjectSet) {
    const { actions, project, workflow, upcomingSubjects } = this.props;
    let subjectToLoad;

    if (!upcomingSubjects.forWorkflow[workflow.id]) {
      actions.classifier.fetchSubjects(subjectSet, workflow, subjectToLoad)
      .then(() => actions.classifier.nextSubject(project, workflow));
    } else if (upcomingSubjects.forWorkflow[workflow.id].length > 0) {
      actions.classifier.nextSubject(project, workflow);
    } else if (upcomingSubjects.forWorkflow[workflow.id].length === 0) {
      this.maybePromptWorkflowAssignmentDialog(this.props);
      actions.classifier.fetchSubjects(subjectSet, workflow, subjectToLoad)
      .then(() => actions.classifier.nextSubject(project, workflow));
    }
  }

  loadAppropriateClassification() {
    const { currentClassifications, workflow } = this.props;
    // Create a classification if it doesn't exist for the chosen workflow, then resolve our state with it.
    if (this.state.rejected && this.state.rejected.classification) {
      this.setState({ rejected: null });
    }

    if (currentClassifications.forWorkflow[workflow.id]) {
      this.setState({ classification: currentClassifications.forWorkflow[workflow.id] });
    } else {
      // A subject set is only specified if the workflow is grouped.
      this.getSubjectSet(workflow)
      .then(subjectSet =>
        this.getNextSubject(subjectSet)
      )
      .catch((error) => {
        this.setState({ rejected: { classification: error } });
      });
    }
  }

  shouldWorkflowAssignmentPrompt(nextProps) {
    // Only for Gravity Spy which is assigning workflows to logged in users
    if (nextProps.project.experimental_tools.indexOf('workflow assignment') > -1) {
      const assignedWorkflowID = nextProps.preferences && nextProps.preferences.settings && nextProps.preferences.settings.workflow_id;
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

    const { classification } = this.state;
    console.info('Completed classification', classification);

    let workflow = null;
    let subjects = null;
    ({ workflow, subjects } = classification.links);
    seenThisSession.add(workflow, subjects);
    if (!this.state.demoMode) {
      classificationQueue.add(classification);
    }
    return Promise.resolve(classification);
  }

  loadAnotherSubject() {
    const { actions, workflow } = this.props;
    if (workflow) {
      actions.classifier.resetClassification(workflow);
      this.loadAppropriateClassification();
    }
  }

  maybePromptWorkflowAssignmentDialog(props) {
    if (this.state.promptWorkflowAssignmentDialog) {
      WorkflowAssignmentDialog.start({ splits: props.splits, project: props.project }).then(() =>
        this.setState({ promptWorkflowAssignmentDialog: false })
      ).then(() => {
        if (props.preferences.preferences.selected_workflow !== props.preferences.settings.workflow_id) {
          props.preferences.update({ 'preferences.selected_workflow': props.preferences.settings.workflow_id });
          props.preferences.save();
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
    const { classification } = this.state;
    if (classification) {
      return (
        <Classifier
          key={this.props.workflow.id}
          {...this.props}
          classification={classification}
          demoMode={this.state.demoMode}
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
      <div className={`${(this.props.theme === zooTheme.mode.light) ? 'classify-page' : 'classify-page classify-page--dark-theme'}`}>
        <Helmet title={`${this.props.project.display_name} » ${counterpart('project.classifyPage.title')}`} />

        {this.props.projectIsComplete &&
          <FinishedBanner project={this.props.project} />}

        {this.state.validUserGroup &&
          <p className="anouncement-banner--group">You are classifying as a student of your classroom.</p>}

        {this.renderClassifier()}
        <ProjectThemeButton />
      </div>
    );
  }
}

ProjectClassifyPage.contextTypes = {
  geordi: PropTypes.object,
  initialLoadComplete: PropTypes.bool,
  router: PropTypes.object
};

ProjectClassifyPage.propTypes = {
  actions: PropTypes.shape({}),
  currentClassifications: PropTypes.shape({
    forWorkflow: PropTypes.object
  }),
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
  upcomingSubjects: PropTypes.shape({
    forWorkflow: PropTypes.object
  }),
  user: PropTypes.object,
  workflow: PropTypes.object
};


// For debugging:
window.currentWorkflowForProject = currentWorkflowForProject;
window.classificationQueue = classificationQueue;

const mapStateToProps = state => ({
  currentClassifications: state.classify.currentClassifications,
  subject: state.classify.subject,
  upcomingSubjects: state.classify.upcomingSubjects,
  theme: state.userInterface.theme
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classifier: bindActionCreators(classifierActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectClassifyPage);
