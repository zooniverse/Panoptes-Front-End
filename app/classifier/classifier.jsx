import PropTypes from 'prop-types';
import React from 'react';
import { browserHistory } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import findLastIndex from 'lodash/findLastIndex';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { ThemeProvider } from 'styled-components';
import classNames from 'classnames';

import preloadSubject from '../lib/preload-subject';
import workflowAllowsFlipbook from '../lib/workflow-allows-flipbook';
import workflowAllowsSeparateFrames from '../lib/workflow-allows-separate-frames';
import * as classifierActions from '../redux/ducks/classify';
import * as feedbackActions from '../redux/ducks/feedback';
import * as interventionActions from '../redux/ducks/interventions';
import * as userInterfaceActions from '../redux/ducks/userInterface';
import CacheClassification from '../components/cache-classification';

import Intervention from './components/Intervention';
import Task from './task';
import TaskTabs from './components/TaskTabs';
import TaskArea from './components/TaskArea';
import TaskNav from './task-nav';
import ClassificationSummary from './classification-summary';
import MinicourseButton from './components/MinicourseButton';

import SubjectViewer from '../components/subject-viewer';
import FrameAnnotator from './frame-annotator';
import ExpertOptions from './expert-options';

import openFeedbackModal from '../features/feedback/classifier';

// For easy debugging
window.cachedClassification = CacheClassification;

class Classifier extends React.Component {
  constructor(props) {
    super(props);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
    this.handleSubjectImageLoad = this.handleSubjectImageLoad.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.checkForFeedback = this.checkForFeedback.bind(this);
    this.toggleExpertClassification = this.toggleExpertClassification.bind(this);
    this.updateAnnotations = this.updateAnnotations.bind(this);
    this.updateFeedback = this.updateFeedback.bind(this);
    this.onNextTask = this.onNextTask.bind(this);
    this.onPrevTask = this.onPrevTask.bind(this);
    this.onNextSubject = this.onNextSubject.bind(this);
    this.state = {
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: false,
      annotations: [],
      modelScore: null,
      showIntervention: false,
      showSummary: false,
      workflowHistory: []
    };
  }

  componentDidMount() {
    const annotations = this.props.classification.annotations.slice();
    const workflowHistory = annotations.map(annotation => annotation.task);
    this.setState({ annotations, workflowHistory });
    this.loadSubject(this.props.subject);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      if (this.props.demoMode) {
        this.props.onChangeDemoMode(false);
      }
      if (this.props.classification.gold_standard) {
        this.props.classification.update({ gold_standard: undefined });
      }
    }

    if (nextProps.subject !== this.props.subject) {
      this.loadSubject(nextProps.subject);
    }

    if (this.context.geordi && ((this.props.subject !== nextProps.subject) ||  !this.context.geordi.keys.subjectID)) {
      this.context.geordi.remember({ subjectID: nextProps.subject.id });
    }

    if (nextProps.classification !== this.props.classification) {
      const annotations = nextProps.classification.annotations.slice();
      const workflowHistory = annotations.map(annotation => annotation.task);
      this.setState({ annotations, workflowHistory });
    }
  }

  componentWillUnmount() {
    try {
      !!this.context.geordi && this.context.geordi.forget(['subjectID']);
    } catch (err) {
      console.error(err);
    }
  }

  getExpertClassification(workflow, subject) {
    const awaitExpertClassification = Promise.resolve(
      apiClient.get('/classifications/gold_standard', {
        workflow_id: workflow.id,
        subject_ids: [subject.id]
      })
      .catch(() => [])
      .then(([expertClassification]) => expertClassification)
    );

    awaitExpertClassification.then((expertClassification) => {
      expertClassification = expertClassification || subject.expert_classification_data[workflow.id];
      if (this.props.workflow === workflow && this.props.subject === subject) {
        window.expertClassification = expertClassification;
        this.setState({ expertClassification });
      }
    });
  }

  checkForFeedback(taskId) {
    this.updateFeedback(taskId)

    const { feedback } = this.props;
    const taskFeedback = (feedback.rules && feedback.rules[taskId]) ? feedback.rules[taskId] : [];

    if (!feedback.active || !taskFeedback.length) {
      return Promise.resolve(false);
    }

    const annotations = this.state.annotations.slice();
    const subjectViewerProps = {
      subject: this.props.subject,
      workflow: this.props.workflow,
      project: this.props.project,
      user: this.props.user,
      preferences: this.props.preferences,
      annotations: annotations,
      annotation: {},
      frame: 0,
      frameWrapper: FrameAnnotator,
      showCollect: false,
      zoomControls: false
    };

    return openFeedbackModal({ feedback: taskFeedback, subjectViewerProps, taskId })
      .then(() => {
        const { actions, classification } = this.props;
        const feedback = Object.assign({}, classification.metadata.feedback, { [taskId]: taskFeedback });
        actions.classify.updateMetadata({ feedback });
      });
  }

  updateAnnotations(annotations) {
    this.setState({ annotations });
    this.props.actions.classify.saveAnnotations(annotations);
  }

  updateFeedback(taskId) {
    if (!this.props.feedback.active) {
      return false;
    }

    const { annotations } = this.state;
    const index = findLastIndex(annotations, annotation => annotation.task === taskId);
    const currentAnnotation = index > -1 ? annotations[index] : {};
    this.props.actions.feedback.update(currentAnnotation);
  }

  loadSubject(subject) {
    const { actions, project, workflow } = this.props;
    if (actions.feedback) {
      actions.feedback.init(project, subject, workflow);
    }

    this.setState({
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: true
    });

    if (project.experimental_tools && project.experimental_tools.indexOf('expert comparison summary') > -1) {
      this.getExpertClassification(this.props.workflow, this.props.subject);
    }

    preloadSubject(subject)
    .then(() => {
      if (this.props.subject === subject) { // The subject could have changed while we were loading.
        this.setState({ subjectLoading: false });
        this.props.onLoad();
      }
    });
  }

  // Whenever a subject image is loaded in the annotator, record its size at that time.
  handleSubjectImageLoad(e, frameIndex) {
    const { actions, classification } = this.props;
    this.context.geordi.remember({ subjectID: this.props.subject.id });

    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;
    const subject_dimensions = classification.metadata.subject_dimensions.slice();
    subject_dimensions[frameIndex] = { naturalWidth, naturalHeight, clientWidth, clientHeight };
    actions.classify.updateMetadata({ subject_dimensions });
  }

  handleAnnotationChange(classification, newAnnotation) {
    const { annotations } = this.state;
    const index = findLastIndex(annotations, annotation => annotation.task === newAnnotation.task);
    if (index > -1) {
      annotations[index] = newAnnotation;
      this.updateAnnotations(annotations);
    }
  }

  onNextSubject() {
    this.setState({ showIntervention: false, showSummary: false });
    this.props.onClickNext();
  }

  onNextTask(taskKey) {
    const workflowHistory  = this.state.workflowHistory.slice();
    const prevTaskKey = workflowHistory[workflowHistory.length - 1];
    workflowHistory.push(taskKey);
    if (prevTaskKey) {
      this.checkForFeedback(prevTaskKey)
        .then(() => this.setState({ workflowHistory }));
    } else {
      this.setState({ workflowHistory });
    }
  }

  onPrevTask() {
    const workflowHistory  = this.state.workflowHistory.slice();
    workflowHistory.pop();
    this.setState({ workflowHistory });
  }

  completeClassification(e) {
    const { actions, classification, onComplete, intervention, project, subject, translations, user, workflow } = this.props;
    const originalElement = e.currentTarget;
    const isCmdClick = e.metaKey;
    const annotations = this.state.annotations.slice();
    let workflowHistory = this.state.workflowHistory.slice();
    const taskKey = workflowHistory[workflowHistory.length - 1];

    const showIntervention = user &&
      user.intervention_notifications &&
      intervention;
    const showSummary = !workflow.configuration.hide_classification_summaries ||
      this.subjectIsGravitySpyGoldStandard();
    const showLastStep = showIntervention || showSummary;

    // don't swallow cmd-click on links
    if (!isCmdClick) {
      e.preventDefault();
    }
    const { already_seen, finished_workflow, retired, selection_state, user_has_finished_workflow, selected_at } = subject;
    const workflowTranslation = translations.strings.workflow[workflow.id];
    const mergedInterventions = Object.assign(
      {},
      classification.metadata.interventions,
      {
        messageShown: !!showIntervention,
        opt_in: !!user && user.intervention_notifications
      }
    );
    actions.classify.updateMetadata({
      viewport: {
        width: innerWidth,
        height: innerHeight
      },
      interventions: mergedInterventions,
      subject_selection_state: {
        already_seen,
        finished_workflow,
        retired,
        selection_state,
        user_has_finished_workflow,
        selected_at
      },
      workflow_translation_id: workflowTranslation ? workflowTranslation.id : null,
      user_language: translations.locale
    });
    return this.checkForFeedback(taskKey)
      .then(() => {
        actions.classify.completeClassification(annotations);
        if (!showIntervention && !isCmdClick && originalElement.href) {
          const subjectTalkPath = `/projects/${project.slug}/talk/subjects/${subject.id}`;
          browserHistory.push(subjectTalkPath);
        }
      })
      .then(() => {
        workflowHistory = [];
        this.setState({ annotations, showIntervention, showSummary, workflowHistory });
      })
      .then(onComplete)
      .then(() => {
        return showLastStep ? null : this.onNextSubject();
      })
      .catch(error => console.error(error));
  }

  toggleExpertClassification(value) {
    this.setState({ showingExpertClassification: value });
  }

  changeDemoMode(demoMode) {
    this.props.onChangeDemoMode(demoMode);
  }

  subjectIsGravitySpyGoldStandard() {
    return (this.props.workflow.configuration.gravity_spy_gold_standard && this.props.subject.metadata['#Type'] === 'Gold');
  }

  render() {
    const { actions, goldStandardMode, intervention, user } = this.props;
    const { showIntervention, showSummary, workflowHistory } = this.state;
    const currentTaskKey = workflowHistory.length > 0 ? workflowHistory[workflowHistory.length - 1] : null;
    const taskAreaVariant = goldStandardMode ? 'goldStandardMode' : 'default';
    const largeFormatImage = this.props.workflow.configuration.image_layout && this.props.workflow.configuration.image_layout.includes('no-max-height');
    const classifierClassNames = classNames({
      classifier: true,
      'large-image': largeFormatImage,
      [this.props.className]: !!this.props.className
    });

    let currentClassification;
    let currentTask;
    let currentAnnotation;
    if (this.state.showingExpertClassification) {
      currentClassification = this.state.expertClassification;
      currentClassification.completed = true;
    } else {
      currentClassification = this.props.classification;
      if (!this.props.classification.completed) {
        currentTask = this.props.workflow.tasks[currentTaskKey];
        const index = findLastIndex(this.state.annotations, annotation => annotation.task === currentTaskKey);
        if (index > -1) {
          currentAnnotation = this.state.annotations[index];
        }
      }
    }

    // This is just easy access for debugging.
    window.classification = currentClassification;
    return (
      <div className={classifierClassNames}>
        <SubjectViewer
          user={this.props.user}
          project={this.props.project}
          subject={this.props.subject}
          isFavorite={this.props.subject.favorite}
          workflow={this.props.workflow}
          preferences={this.props.preferences}
          classification={currentClassification}
          annotation={currentAnnotation}
          annotations={this.state.annotations}
          onLoad={this.handleSubjectImageLoad}
          frameWrapper={FrameAnnotator}
          allowFlipbook={workflowAllowsFlipbook(this.props.workflow)}
          allowSeparateFrames={workflowAllowsSeparateFrames(this.props.workflow)}
          onChange={this.handleAnnotationChange.bind(this, currentClassification)}
          playIterations={this.props.workflow.configuration.playIterations}
        />
        <ThemeProvider theme={{ mode: this.props.theme }}>
          <TaskArea variant={taskAreaVariant}>
            <TaskTabs
              projectPreferences={this.props.preferences}
              tutorial={this.props.tutorial}
              user={this.props.user}
              workflow={this.props.workflow}
            />
            {showIntervention &&
              <Intervention
                intervention={intervention}
                onUnmount={actions.classify.clearIntervention}
                user={user}
              />
            }
            {currentTaskKey &&
              <Task
                preferences={this.props.preferences}
                user={this.props.user}
                project={this.props.project}
                workflow={this.props.workflow}
                annotations={this.state.annotations}
                task={currentTask}
                annotation={currentAnnotation}
                subjectLoading={this.state.subjectLoading}
                updateAnnotations={this.updateAnnotations}
              />
            }
            {showSummary &&
              <ClassificationSummary
                project={this.props.project}
                workflow={this.props.workflow}
                subject={this.props.subject}
                classification={currentClassification}
                expertClassification={this.state.expertClassification}
                splits={this.props.splits}
                classificationCount={this.props.classificationCount}
                hasGSGoldStandard={this.subjectIsGravitySpyGoldStandard()}
                toggleExpertClassification={this.toggleExpertClassification}
              />
            }
            <TaskNav
              annotation={currentAnnotation}
              annotations={this.state.annotations}
              classification={currentClassification}
              completeClassification={this.completeClassification}
              completed={showIntervention || showSummary}
              disabled={this.state.subjectLoading}
              nextSubject={this.onNextSubject}
              project={this.props.project}
              subject={this.props.subject}
              task={currentTask}
              workflow={this.props.workflow}
              updateAnnotations={this.updateAnnotations}
              onNextTask={this.onNextTask}
              onPrevTask={this.onPrevTask}
            >
              {!!this.props.expertClassifier &&
                <ExpertOptions
                  userRoles={this.props.userRoles}
                  demoMode={this.props.demoMode}
                  onChangeDemoMode={this.props.onChangeDemoMode}
                />}
            </TaskNav>

            <MinicourseButton
              minicourse={this.props.minicourse}
              projectPreferences={this.props.preferences}
              splits={this.props.splits}
              workflow={this.props.workflow}
              user={this.props.user}
            />

            {!!this.props.demoMode &&
              <p style={{ textAlign: 'center' }}>
                <i className="fa fa-trash" />{' '}
                <small>
                  <strong>Demo mode:</strong>
                  <br />
                  No classifications are being recorded.{' '}
                  <button type="button" className="secret-button" onClick={this.changeDemoMode.bind(this, false)}>
                    <u>Disable</u>
                  </button>
                </small>
              </p>
            }
            {!!currentClassification.gold_standard &&
              <p style={{ textAlign: 'center' }}>
                <i className="fa fa-star" />{' '}
                <small>
                  <strong>Gold standard mode:</strong>
                  <br />
                  Please ensure this classification is completely accurate.{' '}
                  <button type="button" className="secret-button" onClick={() => actions.classify.toggleGoldStandard(undefined)}>
                    <u>Disable</u>
                  </button>
                </small>
              </p>
            }

          </TaskArea>
        </ThemeProvider>
        {React.Children.map(
          this.props.children,
          child => React.cloneElement(child, { annotations: this.state.annotations })
        )}
      </div>
    );
  }
}

Classifier.contextTypes = {
  geordi: PropTypes.object,
  store: PropTypes.object
};

Classifier.propTypes = {
  actions: PropTypes.shape({
    classify: PropTypes.shape({
      updateMetadata: PropTypes.func
    }),
    feedback: PropTypes.shape({
      init: PropTypes.func,
      update: PropTypes.func
    }),
    interventions: PropTypes.shape({
      dismiss: PropTypes.func
    })
  }),
  classification: PropTypes.shape({
    annotations: PropTypes.array,
    completed: PropTypes.bool,
    gold_standard: PropTypes.bool,
    id: PropTypes.string,
    listen: PropTypes.func,
    stopListening: PropTypes.func,
    update: PropTypes.func
  }),
  classificationCount: PropTypes.number,
  className: PropTypes.string,
  demoMode: PropTypes.bool,
  expertClassifier: PropTypes.bool,
  feedback: PropTypes.shape({
    active: PropTypes.bool,
    rules: PropTypes.object
  }),
  goldStandardMode: PropTypes.bool,
  intervention: PropTypes.shape({
    message: PropTypes.string
  }),
  minicourse: PropTypes.shape({
    id: PropTypes.string,
    steps: PropTypes.array
  }),
  preferences: PropTypes.shape({
    id: PropTypes.string
  }),
  project: PropTypes.shape({
    experimental_tools: PropTypes.array,
    id: PropTypes.string,
    slug: PropTypes.string
  }),
  onChangeDemoMode: PropTypes.func,
  onClickNext: PropTypes.func,
  onComplete: PropTypes.func,
  onLoad: PropTypes.func,
  splits: PropTypes.shape({
    subject: PropTypes.object
  }),
  subject: PropTypes.shape({
    favorite: PropTypes.bool,
    id: PropTypes.string,
    metadata: PropTypes.object
  }),
  theme: PropTypes.string,
  tutorial: PropTypes.shape({
    id: PropTypes.string,
    steps: PropTypes.array
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  userRoles: PropTypes.array,
  translations: PropTypes.shape({
    id: PropTypes.string,
    strings: PropTypes.shape({
      workflow: PropTypes.shape({
        id: PropTypes.string
      })
    })
  }),
  workflow: PropTypes.shape({
    configuration: PropTypes.object,
    id: PropTypes.string,
    tasks: PropTypes.object
  })
};

Classifier.defaultProps = {
  actions: {
    interventions: {
      dismiss: () => true
    }
  },
  classification: {
    annotations: []
  },
  classificationCount: 0,
  demoMode: false,
  feedback: {
    active: false
  },
  goldStandardMode: false,
  intervention: null,
  minicourse: null,
  onClickNext: () => null,
  onComplete: () => Promise.resolve(),
  preferences: null,
  project: {},
  onLoad: Function.prototype,
  onChangeDemoMode: Function.prototype,
  splits: null,
  subject: {
    locations: []
  },
  tutorial: null,
  user: null,
  translations: {
    locale: 'en',
    strings: {
      workflow: {
        id: null
      }
    }
  },
  workflow: {
    configuration: {},
    tasks: {}
  }
};

const mapStateToProps = state => ({
  feedback: state.feedback,
  goldStandardMode: state.classify.goldStandardMode,
  intervention: state.classify.intervention,
  theme: state.userInterface.theme,
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classify: bindActionCreators(classifierActions, dispatch),
    feedback: bindActionCreators(feedbackActions, dispatch),
    interventions: bindActionCreators(interventionActions, dispatch),
    theme: bindActionCreators(userInterfaceActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Classifier);
export { Classifier };
