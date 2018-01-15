import React from 'react';
import tasks from './tasks';
import Shortcut from './tasks/shortcut';
import TaskTranslations from './tasks/translations';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  handleAnnotationChange(newAnnotation) {
    const { classification } = this.props;
    const annotations = classification.annotations.slice();
    annotations[annotations.length - 1] = newAnnotation;
    this.props.updateAnnotations(annotations);
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
      onChange: () => this.handleAnnotationChange
    };

    return (
      <div className="task-container" style={this.props.subjectLoading ? disabledStyle : null}>
        <div className="coverable-task-container">
          {persistentHooksBeforeTask.map((HookComponent, i) => {
            const key = i + Math.random();
            return (<HookComponent key={key} {...taskHookProps} />);
          })}

          {!!annotation &&
            <TaskTranslations
              taskKey={annotation.task}
              task={task}
            >
              <TaskComponent
                autoFocus={true}
                taskTypes={tasks}
                workflow={workflow}
                task={task}
                preferences={this.props.preferences}
                annotation={annotation}
                onChange={this.handleAnnotationChange}
              />
            </TaskTranslations>
          }

          {persistentHooksAfterTask.map((HookComponent, i) => {
            const key = i + Math.random();
            return (<HookComponent key={key} {...taskHookProps} />);
          })}

          <hr />

          {!!task.unlinkedTask &&
            <TaskTranslations
              taskKey={task.unlinkedTask}
              task={workflow.tasks[task.unlinkedTask]}
            >
              <Shortcut
                task={task}
                workflow={workflow}
                annotation={annotation}
                onChange={this.handleAnnotationChange}
              />
            </TaskTranslations>
          }

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
  updateAnnotations: React.PropTypes.func,
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

Task.defaultProps = {
  updateAnnotations: () => null
};

export default Task;
