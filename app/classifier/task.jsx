import React from 'react';
import tasks from './tasks';
import Intervention from '../lib/intervention';
import Shortcut from './tasks/shortcut';

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
    classification.annotations.map((classificationAnnotation) => {
      const taskDescription = workflow.tasks[classificationAnnotation.task];
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
      onChange: (...args) => classification.update(args)
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
            return (<HookComponent key={key} {...taskHookProps} />);
          })}

          {!!annotation &&
            <TaskComponent
              autoFocus={true}
              taskTypes={tasks}
              workflow={workflow}
              task={task}
              preferences={this.props.preferences}
              annotation={annotation}
              onChange={this.handleAnnotationChange}
            />
          }

          {persistentHooksAfterTask.map((HookComponent, i) => {
            const key = i + Math.random();
            return (<HookComponent key={key} {...taskHookProps} />);
          })}

          <hr />

          {!!task.unlinkedTask &&
            <Shortcut
              task={task}
              workflow={workflow}
              annotation={annotation}
              classification={classification}
            />}

          {this.props.children}

        </div>
      </div>
    );
  }
}

Task.propTypes = {
  annotation: React.PropTypes.shape({
    shortcut: React.PropTypes.object,
    value: React.PropTypes.any
  }),
  children: React.PropTypes.node,
  classification: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  preferences: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  project: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  subjectLoading: React.PropTypes.bool,
  task: React.PropTypes.shape({
    type: React.PropTypes.string
  }),
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

export default Task;
