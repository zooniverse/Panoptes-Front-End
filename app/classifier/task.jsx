import React from 'react';
import { Link } from 'react-router';
import {getSessionID} from '../lib/session'
import experimentsClient from '../lib/experiments-client';
import interventionMonitor from '../lib/intervention-monitor';
import tasks from './tasks';
import Intervention from '../lib/intervention';
import Shortcut from './tasks/shortcut';

const Task = (props) => {
  const { annotation, classification, task, workflow } = props;
  const disableTalk = classification.metadata.subject_flagged;
  const visibleTasks = Object.keys(workflow.tasks).filter(key => workflow.tasks[key].type !== 'shortcut');

  const TaskComponent = tasks[task.type];

  // Should we disable the "Back" button?
  const onFirstAnnotation = (classification.annotations.indexOf(annotation) === 0);

  // Should we disable the "Next" or "Done" buttons?
  let waitingForAnswer;
  if (TaskComponent.isAnnotationComplete) {
    waitingForAnswer = !props.annotation.shortcut && !TaskComponent.isAnnotationComplete(task, annotation, workflow);
  }

  // Each answer of a single-answer task can have its own `next` key to override the task's.
  let nextTaskKey;
  if (TaskComponent === tasks.single) {
    const currentAnswer = task.answers[annotation.value];
    nextTaskKey = currentAnswer ? currentAnswer.next : '';
  } else {
    nextTaskKey = props.task.next;
  }

  if (!!nextTaskKey && !props.workflow.tasks[nextTaskKey]) {
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
  props.classification.annotations.map(annotation => {
    const taskDescription = props.workflow.tasks[annotation.task];
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
    workflow: props.workflow,
    classification: props.classification,
    onChange: props.classification.update
  };

  function addAnnotationForTask() {
    props.addAnnotationForTask(classification, nextTaskKey);
  }
  return (
    <div className="task-container" style={disabledStyle ? props.subjectLoading : ''}>
      {!!props.renderIntervention &&
        <Intervention
          user={props.user}
          experimentName={interventionMonitor.latestFromSugar['experiment_name']}
          sessionID={getSessionID()}
          interventionID={interventionMonitor.latestFromSugar['next_event']}
          interventionDetails={experimentsClient.constructInterventionFromSugarData(interventionMonitor.latestFromSugar)}
          disableInterventionFunction={props.disableIntervention}
        />
      }
      <div className="coverable-task-container">
        {persistentHooksBeforeTask.map((HookComponent, i) => {
          const key = i + Math.random();
          <HookComponent key={key} {...taskHookProps} />})
        }

        <TaskComponent autoFocus={true} taskTypes={tasks} workflow={props.workflow} task={task} preferences={props.preferences} annotation={annotation} onChange={props.handleAnnotationChange} />

        {persistentHooksAfterTask.map((HookComponent, i) => {
          const key = i + Math.random();
          <HookComponent key={key} {...taskHookProps} />})
        }

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
            <button type="button"
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
          {(nextTaskKey && !annotation.shortcut) ? 
            <button
              type="button"
              className="continue major-button"
              disabled={waitingForAnswer}
              onClick={addAnnotationForTask}
            >
              Next
            </button> :
            <button
              type="button"
              className="continue major-button"
              disabled={waitingForAnswer}
              onClick={props.completeClassification}
            >
              {props.demoMode && <i className="fa fa-trash fa-fw"></i>}
              {props.classification.gold_standard && <i className="fa fa-star fa-fw"></i>}
              {' '}Done
            </button>}
          {props.renderExpertOptions()}
        </nav>
        { props.backButtonWarning && props.renderBackButtonWarning()}

        {props.children}
      </div>
    </div>
  );
};

Task.propTypes ={
  annotation: React.PropTypes.shape({
    shortcut: React.PropTypes.object,
    value: React.PropTypes.object
  }),
  backButtonWarning: React.PropTypes.bool,
  classification: React.PropTypes.object,
  completeClassification: React.PropTypes.func,
  demoMode: React.PropTypes.bool,
  destroyCurrentAnnotation: React.PropTypes.func,
  disableIntervention: React.PropTypes.func,
  handleAnnotationChange: React.PropTypes.func,
  preferences: React.PropTypes.object,
  project: React.PropTypes.object,
  renderBackButtonWarning: React.PropTypes.func,
  renderExpertOptions: React.PropTypes.func,
  renderIntervention: React.PropTypes.func,
  subject: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  subjectLoading: React.PropTypes.bool,
  task: React.PropTypes.object,
  user: React.PropTypes.object,
  warningToggleOn: React.PropTypes.func,
  warningToggleOff: React.PropTypes.func,
  workflow: React.PropTypes.object
}

export default Task;
