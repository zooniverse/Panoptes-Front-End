import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ChangeListener from '../components/change-listener.cjsx';
import experimentsClient from '../lib/experiments-client.coffee';
import interventionMonitor from '../lib/intervention-monitor.coffee';
import preloadSubject from '../lib/preload-subject.coffee';
import SubjectViewer from '../components/subject-viewer.cjsx';
import FrameAnnotator from './frame-annotator';
import workflowAllowsFlipbook from '../lib/workflow-allows-flipbook.coffee';
import workflowAllowsSeparateFrames from '../lib/workflow-allows-separate-frames.coffee';
import RenderSummary from './render-summary';
import RenderGravitySpyGoldStandard from './render-gravity-spy-gold-standard';
import CacheClassification from '../components/cache-classification';
import tasks from './tasks';
import GridTool from './drawing-tools/grid.cjsx';
import { getSessionID } from '../lib/session.coffee';
import TutorialButton from './tutorial-button';
import ExpertOptions from './render-expert-options';
import { VisibilitySplit } from 'seven-ten';
import MiniCourseButton from './mini-course-button';
import { Link } from 'react-router';
import Shortcut from './tasks/shortcut.cjsx';
import {
  RenderNextOrDoneButton,
  RenderDemoOrGoldWarning,
  RenderIntervention,
  VisibilityWrapper,
} from './classifier-helpers';
/* eslint no-param-reassign: ["error", { "props": false }] */

// For easy debugging
window.cachedClassification = CacheClassification;

class Classifier extends React.Component {
  constructor(props) {
    super(props);
    this.disableIntervention = this.disableIntervention.bind(this);
    this.enableIntervention = this.enableIntervention.bind(this);
    this.warningToggleOn = this.warningToggleOn.bind(this);
    this.warningToggleOff = this.warningToggleOff.bind(this);
    this.loadSubject = this.loadSubject.bind(this);
    this.getExpertClassification = this.getExpertClassification.bind(this);
    this.prepareToClassify = this.prepareToClassify.bind(this);
    this.addAnnotationForTask = this.addAnnotationForTask.bind(this);
    this.destroyCurrentAnnotation = this.destroyCurrentAnnotation.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.handleGoldStandardChange = this.handleGoldStandardChange.bind(this);
    this.handleDemoModeChange = this.handleDemoModeChange.bind(this);
    this.handleSubjectImageLoad = this.handleSubjectImageLoad.bind(this);
    this.subjectIsGravitySpyGoldStandard = this.subjectIsGravitySpyGoldStandard.bind(this);
    this.renderTask = this.renderTask.bind(this);
    this.renderGravitySpyGoldStandard = this.renderGravitySpyGoldStandard.bind(this);
    this.renderSummary = this.renderSummary.bind(this);
    this.state = {
      backButtonWarning: false,
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: false,
      renderIntervention: false,
    };
  }

  componentWillMount() {
    interventionMonitor.setProjectSlug(this.props.project.slug);
    // moved setState here to avoid re-render on componentDidMount
    this.setState({ renderIntervention: interventionMonitor.shouldShowIntervention() });
  }

  componentDidMount() {
    experimentsClient.startOrResumeExperiment(interventionMonitor, this.context.geordi);
    interventionMonitor.on('interventionRequested', this.enableIntervention);
    interventionMonitor.on('classificationTaskRequested', this.disableIntervention);
    this.loadSubject(this.props.subject);
    this.prepareToClassify(this.props.classification);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.classification !== this.props.classification) {
      this.prepareToClassify(nextProps.classification);
    }
    if (nextProps.subject !== this.props.subject) {
      this.loadSubject(nextProps.subject);
    }
    if (this.context.geordi) {
      if ((nextProps.subject !== this.props.subject) || (!this.context.geordi.keys.subjectID)) {
        if (nextProps.subject) {
          this.context.geordi.remember({ subjectID: nextProps.subject.id });
        }
      }
    }
  }

  componentWillUnmount() {
    interventionMonitor.removeListener('interventionRequested', this.enableIntervention);
    interventionMonitor.removeListener('classificationTaskRequested', this.disableIntervention);
    try {
      if (this.context.geordi) {
        this.context.geordi.forget(['subjectID']);
      }
    } catch (e) {
      if (console) {
        console.log(e);
      }
    }
  }

  getHookComponts(persistentHooksList, taskHookProps) {
    const hookComponents = persistentHooksList.map((HookComponent, i) => {
      const key = i + Math.random();
      return <HookComponent key={key} {...taskHookProps} />;
    });
    return hookComponents;
  }

  getExpertClassification(workflow, subject) {
    const awaitExpertClassification = Promise.resolve(() => {
      apiClient.get('/classifications/gold_standard', {
        workflow_id: workflow.id,
        subject_ids: [subject.id],
      }).catch(() => {
        return [];
      }).then(([expertClassification]) => {
        return expertClassification;
      });
    });
    awaitExpertClassification.then((expertClassificationIn) => {
      let subjectExpertClassificationData;
      if (subject.expert_classification_data) {
        subjectExpertClassificationData = subject.expert_classification_data[workflow.id];
      }
      const expertClassification = expertClassificationIn || subjectExpertClassificationData;
      if ((this.props.workflow === workflow) && (this.props.subject === subject)) {
        window.expertClassification = expertClassification;
        this.setState({ expertClassification });
      }
    });
  }

  prepareToClassify(classification) {
    classification.annotations = classification.annotations || [];
    if (classification.annotations.length === 0) {
      this.addAnnotationForTask(classification, this.props.workflow.first_task);
    }
  }

  addAnnotationForTask(classification, taskKey) {
    const taskDescription = this.props.workflow.tasks[taskKey];
    let annotation = tasks[taskDescription.type].getDefaultAnnotation(taskDescription, this.props.workflow, tasks);
    annotation.task = taskKey;
    if (this.props.workflow.configuration && this.props.workflow.configuration.persist_annotations) {
      const cachedAnnotation = CacheClassification.isAnnotationCached(taskKey);
      if (cachedAnnotation) {
        annotation = cachedAnnotation;
      }
    }
    classification.annotations.push(annotation);
    classification.update('annotations');
  }

  destroyCurrentAnnotation() {
    const lastAnnotation = this.props.classification.annotations[this.props.classification.annotations.length - 1];
    this.props.classification.annotations.pop();
    this.props.classification.update('annotations');
    if (this.props.workflow.configuration && this.props.workflow.persist_annotations) {
      CacheClassification.update(lastAnnotation);
    }
  }

  completeClassification() {
    if (this.props.workflow.configuration.persist_annotations) {
      CacheClassification.delete();
    }
    const currentAnnotation = this.props.classification.annotations[this.props.classification.annotations.length - 1];
    let currentTask;
    if (currentAnnotation) {
      currentTask = this.props.workflow.tasks[currentAnnotation.task];
    }
    if (currentTask && currentTask.tools) {
      for (const tool of currentTask.tools) {
        if (tool.type) {
          GridTool.mapCells(this.props.classification.annotations);
        }
      }
    }
    this.props.classification.update(
      {
        completed: true,
        'metadata.session': getSessionID(),
        'metadata.finished_at': (new Date).toISOString(),
        'metadata.viewport': {
          width: innerWidth,
          height: innerHeight,
        },
      }
    );
    if (currentAnnotation.shortcut) {
      // not sure what this code block even does
      // newAnnotation is never used anywhere...
      this.addAnnotationForTask(this.props.classification, currentTask.unlinkedTask);
      const newAnnotation = this.props.classification.annotations[this.props.classification.annotations.length - 1];
      newAnnotation.value = currentAnnotation.shortcut.index;
      delete currentAnnotation.shortcut;
    }
    if (this.props.workflow.configuration && this.props.workflow.configuration.hide_classification_summaries && !this.subjectIsGravitySpyGoldStandard()) {
      if (this.props.onCompleteAndLoadAnotherSubject) {
        this.props.onCompleteAndLoadAnotherSubject();
      }
    } else {
      if (this.props.onComplete) {
        this.props.onComplete().then((classification) => {
          // after classification is saved, if we are in an experiment and logged in, notify experiment server to advance the session plan
          const experimentName = experimentsClient.checkForExperiment(this.props.project.slug);
          if (experimentName && this.props.user) {
            experimentsClient.postDataToExperimentServer(
              interventionMonitor,
              this.context.geordi,
              experimentName,
              this.props.user.id,
              classification.metadata.session,
              'classification',
              classification.id
            );
          }
        }, (error) => {
          console.log(error);
        });
      }
    }
  }

  loadSubject(subject) {
    this.setState({
      expertClassification: null,
      selectedExpertAnnotation: -1,
      showingExpertClassification: false,
      subjectLoading: true,
    });
    if (this.props.project.experimental_tools.indexOf('expert comparison summary') > -1) {
      this.getExpertClassification(this.props.workflow, this.props.subject);
    }
    preloadSubject(subject).then(() => {
      // The subject could have changed while we were loading.
      if (this.props.subject === subject) {
        this.setState({ subjectLoading: false });
        if (this.props.onLoad) {
          this.props.onLoad();
        }
      }
    });
  }

  disableIntervention() {
    this.setState({ renderIntervention: false });
  }

  enableIntervention() {
    let latestFromSugar;
    if (interventionMonitor) {
      latestFromSugar = interventionMonitor.latestFromSugar;
    }
    experimentsClient.logExperimentState(this.context.geordi, latestFromSugar, 'interventionDetected');
    this.setState({ renderIntervention: true });
  }

  warningToggleOn() {
    let backButtonWarning = true;
    if (this.props.workflow.configuration.persist_annotations) {
      backButtonWarning = false;
    }
    this.setState({ backButtonWarning });
  }

  warningToggleOff() {
    this.setState({ backButtonWarning: false });
  }

  subjectIsGravitySpyGoldStandard() {
    let isGold = false;
    if (this.props.workflow.configuration && this.props.subject.metadata) {
      if (this.props.workflow.configuration.gravity_spy_gold_standard && (this.props.subject.metadata['#Type'] === 'Gold')) {
        isGold = true;
      }
    }
    return isGold;
  }

  handleAnnotationChange(classification, newAnnotation) {
    classification.annotations[classification.annotations.length - 1] = newAnnotation;
    classification.update('annotations');
  }

  handleGoldStandardChange(e) {
    this.props.classification.update({ gold_standard: e.target.checked || undefined });
  }

  handleDemoModeChange(e) {
    this.props.onChangeDemoMode(e.target.checked);
  }

  handleSubjectImageLoad(e, frameIndex) {
    if (this.context.geordi) {
      if (this.props.subject) {
        this.context.geordi.remember({ subjectID: this.props.subject.id });
      }
    }
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } = e.target;
    const changes = {};
    changes[`metadata.subject_dimensions.${frameIndex}`] = { naturalWidth, naturalHeight, clientWidth, clientHeight };
    this.props.classification.update(changes);
  }

  renderTask(currentClassification, currentAnnotation, currentTask) {
    const visibleTasks = Object.keys(this.props.workflow.tasks).filter((key) => {
      if (this.props.workflow.tasks[key] !== 'shortcut') {
        return key;
      } else {
        return null;
      }
    });
    const TaskComponent = tasks[currentTask.type];
    // Should we disable the "Back" button?
    const onFirstAnnotation = (currentClassification.annotations.indexOf(currentAnnotation) === 0);
    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer;
    if (TaskComponent.isAnnotationComplete) {
      waitingForAnswer = (!currentAnnotation.shortcut) && (!TaskComponent.isAnnotationComplete(currentTask, currentAnnotation, this.props.workflow));
    }
    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let currentAnswer;
    let nextTaskKey = currentTask.next;
    if (TaskComponent === tasks.single) {
      if (currentTask.answers) {
        currentAnswer = currentTask.answers[currentAnnotation.value];
      }
      if (currentAnswer) {
        nextTaskKey = currentAnswer.next;
      }
    }
    if (!this.props.workflow.tasks[nextTaskKey]) {
      nextTaskKey = '';
    }
    // TODO: Actually disable things that should be.
    // For now we'll just make them non-mousable.
    const disabledStyle = {
      opacity: 0.5,
      pointerEvents: 'none',
    };
    // Run through the existing annotations to build up sets of persistent hooks in the order of the associated annotations. Skip duplicates.
    const persistentHooksBeforeTask = [];
    const persistentHooksAfterTask = [];
    for (const annotation of this.props.classification.annotations) {
      const taskDescription = this.props.workflow.tasks[annotation.task];
      const { PersistBeforeTask, PersistAfterTask } = tasks[taskDescription.type];
      if (PersistBeforeTask && (persistentHooksBeforeTask.indexOf(PersistBeforeTask) === -1)) {
        persistentHooksBeforeTask.push(PersistBeforeTask);
      }
      if (PersistAfterTask && (persistentHooksAfterTask.indexOf(PersistAfterTask) === -1)) {
        persistentHooksAfterTask.push(PersistAfterTask);
      }
    }
    // These props will be passed into the hooks. Append as necessary when creating hooks.
    const taskHookProps = {
      taskTypes: tasks,
      workflow: this.props.workflow,
      classification: currentClassification,
      onChange: () => { currentClassification.update(); },
    };

    let style;
    if (this.state.subjectLoading) {
      style = disabledStyle;
    }

    return (
      <div className="task-container" style={style}>
        <RenderIntervention
          visible={this.state.renderIntervention}
          interventionMonitor={interventionMonitor}
          experimentsClient={experimentsClient}
          user={this.props.user}
          sessionID={getSessionID()}
          disableInterventionFunction={this.disableIntervention}
        />
        <div className="coverable-task-container">
          {this.getHookComponts(persistentHooksBeforeTask, taskHookProps)}
          <TaskComponent
            autoFocus
            taskTypes={tasks}
            workflow={this.props.workflow}
            task={currentTask}
            preferences={this.props.preferences}
            annotation={currentAnnotation}
            onChange={this.handleAnnotationChange.bind(this, this.props.classification)}
          />
          {this.getHookComponts(persistentHooksAfterTask, taskHookProps)}
          <hr />
          <VisibilityWrapper visible={currentTask.unlinkedTask}>
            <Shortcut
              task={currentTask}
              workflow={this.props.workflow}
              annotation={currentAnnotation}
              classification={this.props.classification}
            />
          </VisibilityWrapper>
          <nav className="task-nav">
            <VisibilityWrapper visible={visibleTasks.length > 1}>
              <button
                type="button"
                className="back minor-button"
                disabled={onFirstAnnotation}
                onClick={this.destroyCurrentAnnotation}
                onMouseEnter={this.warningToggleOn}
                onFocus={this.warningToggleOn}
                onMouseLeave={this.warningToggleOff}
                onBlur={this.warningToggleOff}
              >
                Back
              </button>
            </VisibilityWrapper>
            <VisibilityWrapper visible={nextTaskKey && this.props.workflow.configuration && this.props.workflow.configuration.hide_classification_summaries && this.props.owner && this.props.project}>
              <Link
                onClick={this.completeClassification}
                to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
                className="talk standard-button"
                style={style}
              >
                Done &amp; Talk
              </Link>
            </VisibilityWrapper>
            <RenderNextOrDoneButton
              nextVisible={nextTaskKey && !currentAnnotation.shortcut}
              demoMode={this.props.demoMode}
              goldMode={this.props.classification.gold_standard}
              disabled={waitingForAnswer}
              onNext={this.addAnnotationForTask.bind(this, currentClassification, nextTaskKey)}
              onDone={this.completeClassification}
            />
            <ExpertOptions
              expertClassifier={this.props.expertClassifier}
              userRoles={this.props.userRoles}
              goldStandard={this.props.classification.gold_standard || false}
              demoMode={this.props.demoMode || false}
              handleGoldStandardChange={this.handleGoldStandardChange}
              handleDemoModeChange={this.handleDemoModeChange}
            />
          </nav>
          <VisibilityWrapper visible={this.state.backButtonWarning}>
            <p className="back-button-warning" >Going back will clear your work for the current task.</p>
          </VisibilityWrapper>
          <p>
            <small>
              <strong>
                <TutorialButton
                  className="minor-button"
                  user={this.props.user}
                  workflow={this.props.workflow}
                  project={this.props.project}
                  dialog={this.props.tutorial}
                  style={{ marginTop: '2em' }}
                >
                  Show the project tutorial
                </TutorialButton>
              </strong>
            </small>
          </p>
          <p>
            <small>
              <strong>
                <VisibilitySplit splits={this.props.splits} splitKey={'mini-course.visible'} elementKey={'button'}>
                  <MiniCourseButton
                    className="minor-button"
                    user={this.props.user}
                    preferences={this.props.preferences}
                    project={this.props.project}
                    workflow={this.props.workflow}
                    dialog={this.props.minicourse}
                    style={{ marginTop: '2em' }}
                  >
                    Restart the project mini-course
                  </MiniCourseButton>
                </VisibilitySplit>
              </strong>
            </small>
          </p>
          <RenderDemoOrGoldWarning
            demoMode={this.props.demoMode}
            goldMode={this.props.classification.gold_standard}
            onChangeDemoMode={this.props.onChangeDemoMode.bind(null, false)}
            onChangeGoldMode={this.props.classification.update.bind(this.props.classification, { gold_standard: undefined })}
          />
        </div>
      </div>
    );
  }

  renderGravitySpyGoldStandard(currentClassification) {
    return <RenderGravitySpyGoldStandard {...this.props} currentClassification={currentClassification} />;
  }

  renderSummary(currentClassification) {
    return (
      <RenderSummary {...this.props} currentClassification={currentClassification}>
        <ExpertOptions
          expertClassifier={this.props.expertClassifier}
          userRoles={this.props.userRoles}
          goldStandard={this.props.classification.gold_standard || false}
          demoMode={this.props.demoMode || false}
          handleGoldStandardChange={this.handleGoldStandardChange}
          handleDemoModeChange={this.handleDemoModeChange}
        />
      </RenderSummary>
    );
  }

  render() {
    const largeFormatImage = (this.props.workflow.configuration.image_layout) && (this.props.workflow.configuration.image_layout.indexOf('no-max-height') > -1);
    let classifierClassNames = 'classifier';
    if (largeFormatImage) {
      classifierClassNames += ' large-image';
    }
    return (
      <ChangeListener target={this.props.classification}>
        {() => {
          let currentClassification = this.props.classification;
          let currentAnnotation;
          let currentTask;
          if (this.state.showingExpertClassification) {
            currentClassification = this.state.expertClassification;
          } else {
            if (!this.props.classification.completed) {
              currentAnnotation = currentClassification.annotations[currentClassification.annotations.length - 1];
              if (currentAnnotation) {
                currentTask = this.props.workflow.tasks[currentAnnotation.task];
              }
            }
          }
          let taskArea;
          if (currentTask) {
            taskArea = this.renderTask(currentClassification, currentAnnotation, currentTask);
          } else if (this.subjectIsGravitySpyGoldStandard()) {
            taskArea = this.renderGravitySpyGoldStandard(currentClassification);
          } else if (!this.props.workflow.configuration.hide_classification_summaries) {
            taskArea = this.renderSummary(currentClassification);
          }
          window.classification = currentClassification;
          return (
            <div className={classifierClassNames}>
              <SubjectViewer
                user={this.props.user}
                project={this.props.project}
                subject={this.props.subject}
                workflow={this.props.workflow}
                preferences={this.props.preferences}
                classification={currentClassification}
                annotation={currentAnnotation}
                onLoad={this.handleSubjectImageLoad}
                frameWrapper={FrameAnnotator}
                allowFlipbook={workflowAllowsFlipbook(this.props.workflow)}
                allowSeparateFrames={workflowAllowsSeparateFrames(this.props.workflow)}
                onChange={this.handleAnnotationChange.bind(this, currentClassification)}
                playIterations={this.props.workflow.configuration.playIterations}
              />
              <div className="task-area">
                {taskArea}
              </div>
            </div>
          );
        }}
      </ChangeListener>
    );
  }
}

Classifier.defaultProps = {
  user: null,
  workflow: null,
  subject: null,
  classification: null,
  onLoad: Function.prototype,
  tutorial: null,
  minicourse: null
};

Classifier.propTypes = {
  user: React.PropTypes.object,
  workflow: React.PropTypes.object,
  subject: React.PropTypes.object,
  classification: React.PropTypes.object,
  preferences: React.PropTypes.object,
  project: React.PropTypes.object,
  onLoad: React.PropTypes.func,
  onChangeDemoMode: React.PropTypes.func,
  onClickNext: React.PropTypes.func,
  onCompleteAndLoadAnotherSubject: React.PropTypes.func,
  onComplete: React.PropTypes.func,
  owner: React.PropTypes.object,
  demoMode: React.PropTypes.bool,
  userRoles: React.PropTypes.array,
  expertClassifier: React.PropTypes.bool,
  splits: React.PropTypes.object,
  tutorial: React.PropTypes.object,
  minicourse: React.PropTypes.object
};

Classifier.contextTypes = {
  geordi: React.PropTypes.object,
};

export default Classifier;
