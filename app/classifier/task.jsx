import React from 'react';
import tasks from './tasks';
import Intervention from '../lib/intervention';
import Shortcut from './tasks/shortcut';
import TaskNav from './task-nav';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  handleAnnotationChange(newAnnotation) {
    const { classification } = this.props;
    classification.annotations[classification.annotations.length - 1] = newAnnotation;
    classification.update('annotations');
  }

  render() {
    const { annotation, classification, workflow } = this.props;
    const task = this.props.task ? this.props.task : workflow.tasks[workflow.first_task];
    const TaskComponent = tasks[task.type];

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
      <div className="task-container" style={this.props.subjectLoading ? disabledStyle : null}>
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

          <TaskNav
            annotation={annotation}
            classification={classification}
            completeClassification={this.props.completeClassification}
            demoMode={this.props.demoMode}
            project={this.props.project}
            subject={this.props.subject}
            task={task}
            workflow={workflow}
          >
            {this.props.renderExpertOptions()}
          </TaskNav>

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
