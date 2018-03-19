import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Translate from 'react-translate-component';
import tasks from './tasks';
import CacheClassification from '../components/cache-classification';
import TaskBackButton from './tasks/components/TaskBackButton';
/* eslint-disable multiline-ternary, no-nested-ternary, react/jsx-no-bind */

class TaskNav extends React.Component {
  constructor(props) {
    super(props);
    this.addAnnotationForTask = this.addAnnotationForTask.bind(this);
    this.completeClassification = this.completeClassification.bind(this);
    this.destroyCurrentAnnotation = this.destroyCurrentAnnotation.bind(this);
  }

  componentDidUpdate() {
    const { workflow, annotations } = this.props;
    if (annotations.length === 0) {
      this.addAnnotationForTask(workflow.first_task);
    }
  }
  // Next (or first question)
  addAnnotationForTask(taskKey) {
    const { workflow } = this.props;
    const taskDescription = workflow.tasks[taskKey];
    let annotation = tasks[taskDescription.type].getDefaultAnnotation(taskDescription, workflow, tasks);
    annotation.task = taskKey;

    if (workflow.configuration.persist_annotations) {
      const cachedAnnotation = CacheClassification.isAnnotationCached(taskKey);
      if (cachedAnnotation) {
        annotation = cachedAnnotation;
      }
    }

    const annotations = this.props.annotations.slice();
    annotations.push(annotation);
    this.props.updateAnnotations(annotations);
    this.props.onNextTask(taskKey);
  }

  // Done
  completeClassification(e) {
    const { workflow } = this.props;
    if (workflow.configuration.persist_annotations) {
      CacheClassification.delete();
    }
    this.props.completeClassification(e);
  }

  // Back
  destroyCurrentAnnotation() {
    const { workflow } = this.props;

    const annotations = this.props.annotations.slice();
    const lastAnnotation = annotations[annotations.length - 1];
    annotations.pop();
    this.props.updateAnnotations(annotations);
    this.props.onPrevTask();

    if (workflow.configuration.persist_annotations) {
      CacheClassification.update(lastAnnotation);
    }
  }

  render() {
    const completed = !!this.props.classification.completed;

    const task = this.props.task ? this.props.task : this.props.workflow.tasks[this.props.workflow.first_task];

    const disableTalk = this.props.classification.metadata.subject_flagged;
    const visibleTasks = Object.keys(this.props.workflow.tasks).filter(key => this.props.workflow.tasks[key].type !== 'shortcut');
    const TaskComponent = tasks[task.type];

    // Should we disable the "Back" button?
    // const onFirstAnnotation = !completed && (this.props.classification.annotations.indexOf(this.props.annotation) === 0);

    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer = this.props.disabled;
    if (TaskComponent && TaskComponent.isAnnotationComplete && this.props.annotation) {
      waitingForAnswer = !this.props.annotation.shortcut && !TaskComponent.isAnnotationComplete(task, this.props.annotation, this.props.workflow);
    }

    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let nextTaskKey = '';
    if (TaskComponent === tasks.single && this.props.annotation) {
      const currentAnswer = task.answers[this.props.annotation.value];
      nextTaskKey = currentAnswer ? currentAnswer.next : '';
    } else {
      nextTaskKey = task.next;
    }

    if (nextTaskKey && !this.props.workflow.tasks[nextTaskKey]) {
      nextTaskKey = '';
    }

    // TODO: Actually disable things that should be.
    // For now we'll just make them non-mousable.
    const disabledStyle = {
      opacity: 0.5,
      pointerEvents: 'none'
    };

    return (
      <div>
        <nav className="task-nav">
          <TaskBackButton
            areAnnotationsPersisted={this.props.workflow.configuration.persist_annotations}
            destroyCurrentAnnotation={this.destroyCurrentAnnotation}
            showButton={visibleTasks.length > 1 && !completed && (this.props.classification.annotations.indexOf(this.props.annotation) === 0)}
          />
          {(!nextTaskKey && this.props.workflow.configuration.hide_classification_summaries && this.props.project && !disableTalk && !completed) &&
            <Link
              onClick={this.completeClassification}
              to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
              className="talk standard-button"
              style={waitingForAnswer ? disabledStyle : {}}
            >
              <Translate content="classifier.doneAndTalk" />
            </Link>}
          {(nextTaskKey && this.props.annotation && !this.props.annotation.shortcut) ?
            <button
              type="button"
              className="continue-button"
              disabled={waitingForAnswer}
              onClick={this.addAnnotationForTask.bind(this, nextTaskKey)}
            >
              <Translate content="classifier.next" />
              <i className="fa fa-long-arrow-right" />
            </button> : !completed ?
              <button
                type="button"
                className="continue-button"
                disabled={waitingForAnswer}
                onClick={this.completeClassification}
              >
                {this.props.demoMode && <i className="fa fa-trash fa-fw" />}
                {this.props.classification.gold_standard && <i className="fa fa-star fa-fw" />}
                {' '}<Translate content="classifier.done" />
              </button> :
              null
          }
          {completed &&
            <Link
              onClick={this.props.nextSubject}
              to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
              className="talk standard-button"
            >
              <Translate content="classifier.talk" />
            </Link>}
          {completed &&
            <button
              autoFocus={this.props.autoFocus}
              className="continue-button"
              onClick={this.props.nextSubject}
            >
              <Translate content="classifier.next" />
            <i className="fa fa-long-arrow-right" />
            </button>}
          {this.props.children}
        </nav>
      </div>
    );
  }
}

TaskNav.propTypes = {
  annotation: PropTypes.shape({
    shortcut: PropTypes.object,
    value: PropTypes.any
  }),
  annotations: PropTypes.arrayOf(PropTypes.object),
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  classification: PropTypes.shape({
    annotations: PropTypes.array,
    completed: PropTypes.bool,
    gold_standard: PropTypes.bool,
    id: PropTypes.string,
    metadata: PropTypes.object
  }),
  completeClassification: PropTypes.func,
  disabled: PropTypes.bool,
  nextSubject: PropTypes.func,
  demoMode: PropTypes.bool,
  project: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string
  }),
  subject: PropTypes.shape({
    id: PropTypes.string
  }),
  task: PropTypes.shape({
    type: PropTypes.string
  }),
  updateAnnotations: PropTypes.func,
  workflow: PropTypes.shape({
    id: PropTypes.string,
    configuration: PropTypes.object,
    first_task: PropTypes.string,
    tasks: PropTypes.object
  })
};

TaskNav.defaultProps = {
  annotations: [],
  autoFocus: true,
  disabled: false,
  updateAnnotations: () => null
};

export default TaskNav;
