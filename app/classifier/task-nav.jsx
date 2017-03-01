import React from 'react';
import { Link } from 'react-router';
import tasks from './tasks';

const TaskNav = (props) => {
  const task = props.task ? props.task : props.workflow.tasks[props.workflow.first_task];

  const disableTalk = props.classification.metadata.subject_flagged;
  const visibleTasks = Object.keys(props.workflow.tasks).filter(key => props.workflow.tasks[key].type !== 'shortcut');
  const TaskComponent = tasks[task.type];

  // Should we disable the "Back" button?
  const onFirstAnnotation = (props.classification.annotations.indexOf(props.annotation) === 0);

  // Should we disable the "Next" or "Done" buttons?
  let waitingForAnswer;
  if (TaskComponent && TaskComponent.isAnnotationComplete) {
    waitingForAnswer = !props.annotation.shortcut && !TaskComponent.isAnnotationComplete(task, props.annotation, props.workflow);
  }

  // Each answer of a single-answer task can have its own `next` key to override the task's.
  let nextTaskKey;
  if (TaskComponent === tasks.single) {
    const currentAnswer = task.answers[props.annotation.value];
    nextTaskKey = currentAnswer ? currentAnswer.next : '';
  } else {
    nextTaskKey = task.next;
  }

  if (nextTaskKey && !props.workflow.tasks[nextTaskKey]) {
    nextTaskKey = '';
  }

  // TODO: Actually disable things that should be.
  // For now we'll just make them non-mousable.
  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: 'none'
  };

  return (
  <nav className="task-nav">
    {(visibleTasks.length > 1) &&
      <button
        type="button"
        className="back minor-button"
        disabled={onFirstAnnotation}
        onClick={props.destroyCurrentAnnotation}
        onMouseEnter={props.warningToggleOn}
        onFocus={props.warningToggleOn}
        onMouseLeave={props.warningToggleOff}
        onBlur={props.warningToggleOff}
      >
        Back
      </button>}
    {(!nextTaskKey && props.workflow.configuration.hide_classification_summaries && props.project && !disableTalk) &&
      <Link
        onClick={props.completeClassification}
        to={`/projects/${props.project.slug}/talk/subjects/${props.subject.id}`}
        className="talk standard-button"
        style={waitingForAnswer ? disabledStyle : {}}
      >
        Done &amp; Talk
      </Link>}
    {(nextTaskKey && !props.annotation.shortcut) ?
      <button
        type="button"
        className="continue major-button"
        disabled={waitingForAnswer}
        onClick={props.addAnnotationForTask.bind(this, nextTaskKey)}
      >
        Next
      </button> :
      <button
        type="button"
        className="continue major-button"
        disabled={waitingForAnswer}
        onClick={props.completeClassification}
      >
        {props.demoMode && <i className="fa fa-trash fa-fw" />}
        {props.classification.gold_standard && <i className="fa fa-star fa-fw" />}
        {' '}Done
      </button>}
    {props.renderExpertOptions()}
  </nav>
  );
};

TaskNav.propTypes = {
  addAnnotationForTask: React.PropTypes.func,
  annotation: React.PropTypes.shape({
    shortcut: React.PropTypes.object,
    value: React.PropTypes.any.isRequired
  }),
  classification: React.PropTypes.object,
  completeClassification: React.PropTypes.func,
  demoMode: React.PropTypes.bool,
  destroyCurrentAnnotation: React.PropTypes.func,
  project: React.PropTypes.object,
  renderExpertOptions: React.PropTypes.func,
  subject: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  task: React.PropTypes.object,
  warningToggleOn: React.PropTypes.func,
  warningToggleOff: React.PropTypes.func,
  workflow: React.PropTypes.object
};

export default TaskNav;
