import React from 'react';
import { Link } from 'react-router';
import { getSessionID } from '../lib/session';
import CacheClassification from '../components/cache-classification';
import tasks from './tasks';
import GridTool from './drawing-tools/grid';
import Intervention from '../lib/intervention';
import Shortcut from './tasks/shortcut';

const BackButtonWarning = (props) =>
  <p className="back-button-warning" >Going back will clear your work for the current task.</p>;

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
    this.addAnnotationForTask = this.addAnnotationForTask.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.destroyCurrentAnnotation = this.destroyCurrentAnnotation.bind(this);
    this.warningToggleOn = this.warningToggleOn.bind(this);
    this.warningToggleOff = this.warningToggleOff.bind(this);
    this.state = {
      BackButtonWarning: false
    };
  }

  componentWillMount() {
    const { workflow, classification } = this.props;
    classification.annotations = classification.annotations ? classification.annotations : [];
    if (classification.annotations.length === 0) {
      this.addAnnotationForTask(workflow.first_task);
    }
  }

  handleAnnotationChange(newAnnotation) {
    const { classification } = this.props;
    classification.annotations[classification.annotations.length - 1] = newAnnotation;
    classification.update('annotations');
  }

  // Next (or first question)
  addAnnotationForTask(taskKey) {
    const { workflow, classification } = this.props;
    const taskDescription = workflow.tasks[taskKey];
    let annotation = tasks[taskDescription.type].getDefaultAnnotation(taskDescription, workflow, tasks);
    annotation.task = taskKey;

    if (workflow.configuration.persist_annotations) {
      const cachedAnnotation = CacheClassification.isAnnotationCached(taskKey);
      if (cachedAnnotation) {
        annotation = cachedAnnotation;
      }
    }

    classification.annotations.push(annotation);
    classification.update('annotations');
  }

  // Done
  completeClassification() {
    const { workflow, classification } = this.props;
    if (workflow.configuration.persist_annotations) {
      CacheClassification.delete();
    }

    const currentAnnotation = classification.annotations[classification.annotations.length - 1];
    const currentTask = workflow.tasks[currentAnnotation.task];
    !!currentTask && !!currentTask.tools && currentTask.tools.map((tool) => {
      if (tool.type === 'grid') {
        GridTool.mapCells(classification.annotations);
      }
    });
    classification.update({
      completed: true,
      'metadata.session': getSessionID(),
      'metadata.finished_at': (new Date()).toISOString(),
      'metadata.viewport': {
        width: innerWidth,
        height: innerHeight
      }
    });

    if (currentAnnotation.shortcut) {
      this.addAnnotationForTask(currentTask.unlinkedTask);
      const newAnnotation = classification.annotations[classification.annotations.length - 1];
      newAnnotation.value = currentAnnotation.shortcut.index;
      delete currentAnnotation.shortcut;
    }
    this.props.completeClassification();
  }

  // Back
  destroyCurrentAnnotation() {
    const { workflow, classification } = this.props;
    const lastAnnotation = classification.annotations[classification.annotations.length - 1];

    classification.annotations.pop();
    classification.update('annotations');

    if (workflow.configuration.persist_annotations) {
      CacheClassification.update(lastAnnotation);
    }
  }

  warningToggleOn() {
    if (!this.props.workflow.configuration.persist_annotations) {
      this.setState({ backButtonWarning: true });
    }
  }

  warningToggleOff() {
    if (!this.props.workflow.configuration.persist_annotations) {
      this.setState({ backButtonWarning: false });
    }
  }

  render() {
    const { annotation, classification, workflow } = this.props;
    if (!annotation) {
      return null;
    }
    const task = this.props.task ? this.props.task : workflow.tasks[workflow.first_task];

    const disableTalk = classification.metadata.subject_flagged;
    const visibleTasks = Object.keys(workflow.tasks).filter(key => workflow.tasks[key].type !== 'shortcut');
    const TaskComponent = tasks[task.type];

    // Should we disable the "Back" button?
    const onFirstAnnotation = (classification.annotations.indexOf(annotation) === 0);

    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer;
    if (TaskComponent && TaskComponent.isAnnotationComplete) {
      waitingForAnswer = !annotation.shortcut && !TaskComponent.isAnnotationComplete(task, annotation, workflow);
    }

    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let nextTaskKey;
    if (TaskComponent === tasks.single) {
      const currentAnswer = task.answers[annotation.value];
      nextTaskKey = currentAnswer ? currentAnswer.next : '';
    } else {
      nextTaskKey = task.next;
    }

    if (nextTaskKey && !workflow.tasks[nextTaskKey]) {
      nextTaskKey = '';
    }

    // TODO: Actually disable things that should be.
    // For now we'll just make them non-mousable.
    const disabledStyle = {
      opacity: 0.5,
      pointerEvents: 'none'
    };

    // Run through the existing annotations to build up sets of persistent hooks in the order of the associated annotations. Skip duplicates.
    const persistentHooksBeforeTask = [];
    const persistentHooksAfterTask = [];
    classification.annotations.map(annotation => {
      const taskDescription = workflow.tasks[annotation.task];
      const { PersistBeforeTask, PersistAfterTask } = tasks[taskDescription.type];
      if (PersistBeforeTask && !persistentHooksBeforeTask.includes(PersistBeforeTask)) {
        persistentHooksBeforeTask.push(PersistBeforeTask);
      }
      if (PersistAfterTask && !persistentHooksAfterTask.includes(PersistAfterTask)) {
        persistentHooksAfterTask.push(PersistAfterTask);
      }
    });

    // These props will be passed into the hooks. Append as necessary when creating hooks.
    const taskHookProps = {
      taskTypes: tasks,
      workflow,
      classification,
      onChange: classification.update
    };

    return (
      <div className="task-container" style={this.props.subjectLoading ?  disabledStyle : null}>
        <Intervention
          project={this.props.project}
          user={this.props.user}
        />
        <div className="coverable-task-container">
          {persistentHooksBeforeTask.map((HookComponent, i) => {
            const key = i + Math.random();
            <HookComponent key={key} {...taskHookProps} />;
          })}

          <TaskComponent
            autoFocus={true}
            taskTypes={tasks}
            workflow={workflow}
            task={task}
            preferences={this.props.preferences}
            annotation={annotation}
            onChange={this.handleAnnotationChange}
          />

          {persistentHooksAfterTask.map((HookComponent, i) => {
            const key = i + Math.random();
            <HookComponent key={key} {...taskHookProps} />;
          })}

          <hr />

          {!!task.unlinkedTask &&
            <Shortcut
              task={task}
              workflow={workflow}
              annotation={annotation}
              classification={classification}
            />}

          <nav className="task-nav">
            {(visibleTasks.length > 1) &&
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
              </button>}
            {(!nextTaskKey && workflow.configuration.hide_classification_summaries && this.props.project && !disableTalk) &&
              <Link
                onClick={this.completeClassification}
                to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
                className="talk standard-button"
                style={waitingForAnswer ? disabledStyle : {}}
              >
                Done &amp; Talk
              </Link>}
            {(nextTaskKey && !annotation.shortcut) ?
              <button
                type="button"
                className="continue major-button"
                disabled={waitingForAnswer}
                onClick={this.addAnnotationForTask.bind(this, nextTaskKey)}
              >
                Next
              </button> :
              <button
                type="button"
                className="continue major-button"
                disabled={waitingForAnswer}
                onClick={this.completeClassification}
              >
                {this.props.demoMode && <i className="fa fa-trash fa-fw" />}
                {classification.gold_standard && <i className="fa fa-star fa-fw" />}
                {' '}Done
              </button>}
            {this.props.renderExpertOptions()}
          </nav>
          {this.state.backButtonWarning && <BackButtonWarning />}

          {this.props.children}
        </div>
      </div>
    );
  }
}

Task.propTypes = {
  annotation: React.PropTypes.shape({
    shortcut: React.PropTypes.object,
    value: React.PropTypes.any.isRequired
  }),
  children: React.PropTypes.node,
  classification: React.PropTypes.object,
  completeClassification: React.PropTypes.func,
  demoMode: React.PropTypes.bool,
  preferences: React.PropTypes.object,
  project: React.PropTypes.object,
  renderExpertOptions: React.PropTypes.func,
  subject: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  subjectLoading: React.PropTypes.bool,
  task: React.PropTypes.object,
  user: React.PropTypes.object,
  workflow: React.PropTypes.object
};

export default Task;
