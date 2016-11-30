import React from 'react';
import tasks from './tasks';
import Intervention from '../lib/intervention';
import { getSessionID } from '../lib/session';
import Shortcut from './tasks/shortcut';
import { Link } from 'react-router';
import CacheClassification from '../components/cache-classification';
import GridTool from './drawing-tools/grid';
import TriggeredModalForm from 'modal-form/triggered';
import isAdmin from '../lib/is-admin';
import TutorialButton from './tutorial-button';
import MiniCourseButton from './mini-course-button';
import { VisibilitySplit } from 'seven-ten';

// For easy debugging
window.cachedClassification = CacheClassification;

class RenderTask extends React.Component {
  constructor(props) {
    super(props);
    this.warningToggleOn = this.warningToggleOn.bind(this);
    this.warningToggleOff = this.warningToggleOff.bind(this);
    this.handleGoldStandardChange = this.handleGoldStandardChange.bind(this);
    this.handleDemoModeChange = this.handleDemoModeChange.bind(this);
    this.addAnnotationForTask = this.addAnnotationForTask.bind(this);
    this.destroyCurrentAnnotation = this.destroyCurrentAnnotation.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.state = {
      backButtonWarning: false,
    };
  }

  getHookComponts(persistentHooksList, taskHookProps) {
    const hookComponents = persistentHooksList.map((HookComponent, i) => {
      const key = i + Math.random();
      return <HookComponent key={key} {...taskHookProps} />;
    });
    return hookComponents;
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

  handleGoldStandardChange(e) {
    this.props.classification.update({ gold_standard: e.target.checked || undefined });
  }

  handleDemoModeChange(e) {
    this.props.onChangeDemoMode(e.target.checked);
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
          const experimentName = this.props.experimentsClient.checkForExperiment(this.props.project.slug);
          if (experimentName && this.props.user) {
            this.props.experimentsClient.postDataToExperimentServer(
              this.props.interventionMonitor,
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

  render() {
    const visibleTasks = Object.keys(this.props.workflow.tasks).filter((key) => {
      if (this.props.workflow.tasks[key] !== 'shortcut') {
        return key;
      } else {
        return null;
      }
    });
    const TaskComponent = tasks[this.props.currentTask.type];
    // Should we disable the "Back" button?
    const onFirstAnnotation = (this.props.currentClassification.annotations.indexOf(this.props.currentAnnotation) === 0);
    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer;
    if (TaskComponent.isAnnotationComplete) {
      waitingForAnswer = (!this.props.currentAnnotation.shortcut) && (!TaskComponent.isAnnotationComplete(this.props.currentTask, this.props.currentAnnotation, this.props.workflow));
    }
    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let currentAnswer;
    let nextTaskKey = this.props.currentTask.next;
    if (TaskComponent === tasks.single) {
      if (this.props.currentTask.answers) {
        currentAnswer = this.props.currentTask.answers[this.props.currentAnnotation.value];
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
    for (const annotation of this.classification.annotations) {
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
      classification: this.props.currentClassification,
      onChange: () => { this.props.currentClassification.update(); },
    };

    let style;
    if (this.props.subjectLoading) {
      style = disabledStyle;
    }

    let backButton;
    if (visibleTasks.length > 1) {
      backButton = (
        <button
          type="button"
          className="back minor-button"
          disable={onFirstAnnotation}
          onClick={this.props.destroyCurrentAnnotation}
          onMouseEnter={this.warningToggleOn}
          onFocus={this.warningToggleOn}
          onMouseLeave={this.warningToggleOff}
          onBlur={this.warningToggleOff}
        >
          Back
        </button>
      );
    }

    let doneAndTalkButton;
    if (nextTaskKey && this.props.workflow.configuration && this.props.workflow.configuration.hide_classification_summaries && this.props.owner && this.props.project) {
      const [ownerName, name] = this.props.project.slug.split('/');
      doneAndTalkButton = (
        <Link
          onClick={this.props.completeClassification}
          to={`/projects/${ownerName}/${name}/talk/subjects/${this.props.subject.id}`}
          className="talk standard-button"
          style={style}
        >
          Done &amp; Talk
        </Link>
      );
    }

    let nextOrDoneButton;
    if (nextTaskKey && !this.props.currentAnnotation.shortcut) {
      nextOrDoneButton = (
        <button
          type="button"
          className="continue major-button"
          disabled={waitingForAnswer}
          onClick={this.addAnnotationForTask.bind(this, this.props.currentClassification, nextTaskKey)}
        >
          Next
        </button>
      );
    } else {
      let icon;
      if (this.props.demoMode) {
        icon = <i className="fa fa-trash fa-fw"></i>;
      } else if (this.props.classification.gold_standard) {
        icon = <i className="fa fa-star fa-fw"></i>;
      }
      nextOrDoneButton = (
        <button
          type="button"
          className="continue major-button"
          disabled={waitingForAnswer}
          onClick={this.completeClassification}
        >
          {icon}{' '}Done
        </button>
      );
    }

    let intervention;
    if (this.props.renderIntervention) {
      intervention = (
        <Intervention
          user={this.props.user}
          experimentName={this.props.interventionMonitor.latestFromSugar.experiment_name}
          sessionID={getSessionID()}
          interventionID={this.props.interventionMonitor.latestFromSugar.next_event}
          interventionDetails={this.props.experimentsClient.constructInterventionFromSugarData(this.props.interventionMonitor.latestFromSugar)}
          disableInterventionFunction={this.props.disableIntervention}
        />
      );
    }

    // this can be refactored to its own component
    let expertOptions;
    if (this.props.expertClassifier) {
      let goldStandardMode;
      if ((this.props.userRoles.indexOf('owner') > -1) || (this.props.userRoles.indexOf('expert') > -1)) {
        goldStandardMode = (
          <p>
            <label>
              <input
                type="checkbox"
                checked={this.props.classification.gold_standard}
                onChange={this.handleGoldStandardChange}
              />
              {' '}
              Gold standard mode
            </label>
            {' '}
            <TriggeredModalForm trigger={<i className="fa fa-question-circle"></i>}>
              <p>
                A “gold standard” classification is one that is known to be completely accurate.
                {' '}We’ll compare other classifications against it during aggregation.
              </p>
            </TriggeredModalForm>
          </p>
        );
      }
      let demoMode;
      if (isAdmin() || (this.props.userRoles.indexOf('owner') > -1) || (this.props.userRoles.indexOf('collaborator') > -1)) {
        demoMode = (
          <p>
            <label>
              <input
                type="checkbox"
                checked={this.props.demoMode}
                onChange={this.handleDemoModeChange}
              />
              {' '}
              Demo mode
            </label>
            {' '}
            <TriggeredModalForm trigger={<i className="fa fa-question-circle"></i>}>
              <p>
                In demo mode, classifications <strong>will not be saved</strong>.
                {' '}Use this for quick, inaccurate demos of the classification interface.
              </p>
            </TriggeredModalForm>
          </p>
        );
      }
      expertOptions = (
        <TriggeredModalForm trigger={<i className="fa fa-cog fa-fw"></i>}>
          {goldStandardMode}
          {demoMode}
        </TriggeredModalForm>
      );
    }

    let shortcut;
    if (this.props.currentTask.unlinkedTask) {
      shortcut = (
        <Shortcut
          task={this.props.currentTask}
          workflow={this.props.workflow}
          annotation={this.props.currentAnnotation}
          classification={this.props.classification}
        />
      );
    }

    let backButtonWarning;
    if (this.state.backButtonWarning) {
      backButtonWarning = <p className="back-button-warning" >Going back will clear your work for the current task.</p>;
    }

    let demoOrGoldWarning;
    if (this.props.demoMode) {
      demoOrGoldWarning = (
        <p style={{ textAlign: 'center' }}>
          <i className="fa fa-trash"></i>
          {' '}
          <small>
            <strong>Demo mode:</strong>
            <br />
            No classifications are being recorded.
            {' '}
            <button type="button" className="secret-button" onClick={this.props.onChangeDemoMode.bind(null, false)}>
              <u>Disable</u>
            </button>
          </small>
        </p>
      );
    } else if (this.props.classification.gold_standard) {
      demoOrGoldWarning = (
        <p style={{ textAlign: 'center' }}>
          <i className="fa fa-star"></i>
          {' '}
          <small>
            <strong>Gold standard mode:</strong>
            <br />
            Please ensure this classification is completely accurate.
            {' '}
            <button
              type="button"
              className="secret-button"
              onClick={this.props.classification.update.bind(this.props.classification, { gold_standard: undefined })}
            >
              <u>Disable</u>
            </button>
          </small>
        </p>
      );
    }

    return (
      <div className="task-container" style={style}>
        {intervention}
        <div className="coverable-task-container">
          {this.getHookComponts(persistentHooksBeforeTask, taskHookProps)}
          <TaskComponent
            autoFocus
            taskTypes={tasks}
            workflow={this.props.workflow}
            task={this.props.currentTask}
            preferences={this.props.preferences}
            annotation={this.props.currentAnnotation}
            onChange={this.props.handleAnnotationChange.bind(this, this.porps.classification)}
          />
          {this.getHookComponts(persistentHooksAfterTask, taskHookProps)}
          <hr />
          {shortcut}
          <nav className="task-nav">
            {backButton}
            {doneAndTalkButton}
            {nextOrDoneButton}
            {expertOptions}
          </nav>
          {backButtonWarning}
          <p>
            <small>
              <strong>
                <TutorialButton
                  className="minor-button"
                  user={this.props.user}
                  workflow={this.props.workflow}
                  project={this.props.project}
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
                    style={{ marginTop: '2em' }}
                  >
                    Restart the project mini-course
                  </MiniCourseButton>
                </VisibilitySplit>
              </strong>
            </small>
          </p>
          {demoOrGoldWarning}
        </div>
      </div>
    );
  }
}

RenderTask.propTypes = {
  user: React.PropTypes.object,
  owner: React.PropTypes.object,
  project: React.PropTypes.object,
  subject: React.PropTypes.object,
  currentClassification: React.PropTypes.object,
  classification: React.PropTypes.object,
  preferences: React.PropTypes.object,
  currentAnnotation: React.PropTypes.object,
  workflow: React.PropTypes.object,
  currentTask: React.PropTypes.object,
  subjectLoading: React.PropTypes.bool,
  renderIntervention: React.PropTypes.bool,
  interventionMonitor: React.PropTypes.object,
  experimentsClient: React.PropTypes.object,
  disableIntervention: React.PropTypes.func,
  handleAnnotationChange: React.PropTypes.func,
  destroyCurrentAnnotation: React.PropTypes.func,
  completeClassification: React.PropTypes.func,
  onCompleteAndLoadAnotherSubject: React.PropTypes.func,
  onComplete: React.PropTypes.func,
  demoMode: React.PropTypes.bool,
  userRoles: React.PropTypes.object,
  onChangeDemoMode: React.PropTypes.func,
  expertClassifier: React.PropTypes.bool,
  splits: React.PropTypes.object,
};

export default RenderTask;
