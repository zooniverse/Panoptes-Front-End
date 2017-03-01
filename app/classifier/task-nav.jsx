import React from 'react';
import { Link } from 'react-router';
import tasks from './tasks';

const BackButtonWarning = (props) =>
  <p className="back-button-warning" >Going back will clear your work for the current task.</p>;

class TaskNav extends React.Component {
  constructor(props) {
    super(props);
    this.warningToggleOn = this.warningToggleOn.bind(this);
    this.warningToggleOff = this.warningToggleOff.bind(this);
    this.state = {
      BackButtonWarning: false
    };
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
    const task = this.props.task ? this.props.task : this.props.workflow.tasks[this.props.workflow.first_task];

    const disableTalk = this.props.classification.metadata.subject_flagged;
    const visibleTasks = Object.keys(this.props.workflow.tasks).filter(key => this.props.workflow.tasks[key].type !== 'shortcut');
    const TaskComponent = tasks[task.type];

    // Should we disable the "Back" button?
    const onFirstAnnotation = (this.props.classification.annotations.indexOf(this.props.annotation) === 0);

    // Should we disable the "Next" or "Done" buttons?
    let waitingForAnswer;
    if (TaskComponent && TaskComponent.isAnnotationComplete) {
      waitingForAnswer = !this.props.annotation.shortcut && !TaskComponent.isAnnotationComplete(task, this.props.annotation, this.props.workflow);
    }

    // Each answer of a single-answer task can have its own `next` key to override the task's.
    let nextTaskKey;
    if (TaskComponent === tasks.single) {
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
          {(visibleTasks.length > 1) &&
            <button
              type="button"
              className="back minor-button"
              disabled={onFirstAnnotation}
              onClick={this.props.destroyCurrentAnnotation}
              onMouseEnter={this.warningToggleOn}
              onFocus={this.warningToggleOn}
              onMouseLeave={this.warningToggleOff}
              onBlur={this.warningToggleOff}
            >
              Back
            </button>}
          {(!nextTaskKey && this.props.workflow.configuration.hide_classification_summaries && this.props.project && !disableTalk) &&
            <Link
              onClick={this.props.completeClassification}
              to={`/projects/${this.props.project.slug}/talk/subjects/${this.props.subject.id}`}
              className="talk standard-button"
              style={waitingForAnswer ? disabledStyle : {}}
            >
              Done &amp; Talk
            </Link>}
          {(nextTaskKey && !this.props.annotation.shortcut) ?
            <button
              type="button"
              className="continue major-button"
              disabled={waitingForAnswer}
              onClick={this.props.addAnnotationForTask.bind(this, nextTaskKey)}
            >
              Next
            </button> :
            <button
              type="button"
              className="continue major-button"
              disabled={waitingForAnswer}
              onClick={this.props.completeClassification}
            >
              {this.props.demoMode && <i className="fa fa-trash fa-fw" />}
              {this.props.classification.gold_standard && <i className="fa fa-star fa-fw" />}
              {' '}Done
            </button>}
          {this.props.renderExpertOptions()}
        </nav>
        {this.state.backButtonWarning && <BackButtonWarning />}
      </div>
    );
  }
}

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
  workflow: React.PropTypes.object
};

export default TaskNav;
