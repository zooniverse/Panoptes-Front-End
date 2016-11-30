import React from 'react';
import tasks from './tasks';
import Intervention from '../lib/intervention';
import { getSessionID } from '../lib/session';
import Shortcut from './tasks/shortcut';
import { Link } from 'react-router';
import CacheClassification from '../components/cache-classification';
import GridTool from './drawing-tools/grid';

// For easy debugging
window.cachedClassification = CacheClassification;

class RenderTask extends React.Component {
  constructor(props) {
    super(props);
    this.warningToggleOn = this.warningToggleOn.bind(this);
    this.warningToggleOff = this.warningToggleOff.bind(this);
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
      this.addAnnotationForTask(this.props.classification, currentTask.unlinkedTask);
      const newAnnotation = this.props.classification.annotations[this.props.classification.annotations.length - 1];
      newAnnotation.value = currentAnnotation.shortcut.index;
      delete currentAnnotation.shortcut;
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
    const TaskComponent = tasks[this.props.task.type];
    // Should we disable the "Back" button?
    const onFirstAnnotation = (this.props.classification.annotations.indexOf(this.props.annotation) === 0);
    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer;
    if (TaskComponent.isAnnotationComplete) {
      waitingForAnswer = (!this.props.annotation.shortcut) && (!TaskComponent.isAnnotationComplete(this.props.task, this.props.annotation, this.props.workflow));
    }
    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let currentAnswer;
    let nextTaskKey = this.props.task.next;
    if (TaskComponent === tasks.single) {
      if (this.props.task.answers) {
        currentAnswer = this.props.task.answers[this.props.annotation.value];
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
      classification: this.props.classification,
      onChange: () => { this.props.classification.update(); },
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

    let nextButton;
    if (nextTaskKey && !this.props.annotation.shortcut) {
      // I AM HERE
      // move classification life cycle to this component!
      // completeClassification, destroyCurrentAnnotation, addAnnotationForTask
      nextButton = (
        <button
          type="button"
          className="continue major-button"
          disabled={waitingForAnswer}
          onClick={this.props.addAnnotationForTask.bind()}
        >
          Next
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

    let shortcut;
    if (this.props.task.unlinkedTask) {
      shortcut = (
        <Shortcut
          task={this.props.task}
          workflow={this.props.workflow}
          annotation={this.props.annotation}
          classification={this.props.classification}
        />
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
            task={this.props.task}
            preferences={this.props.preferences}
            annotation={this.props.annotation}
            onChange={this.props.handleAnnotationChange.bind(this, this.porps.classification)}
          />
          {this.getHookComponts(persistentHooksAfterTask, taskHookProps)}
          <hr />
          {shortcut}
          <nav className="task-nav">
            {backButton}
            {doneAndTalkButton}
          </nav>
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
  classification: React.PropTypes.object,
  preferences: React.PropTypes.object,
  annotation: React.PropTypes.object,
  workflow: React.PropTypes.object,
  task: React.PropTypes.object,
  subjectLoading: React.PropTypes.bool,
  renderIntervention: React.PropTypes.bool,
  interventionMonitor: React.PropTypes.object,
  experimentsClient: React.PropTypes.object,
  disableIntervention: React.PropTypes.func,
  handleAnnotationChange: React.PropTypes.func,
  destroyCurrentAnnotation: React.PropTypes.func,
  completeClassification: React.PropTypes.func,
};

export default RenderTask;
