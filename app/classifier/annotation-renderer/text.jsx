import PropTypes from 'prop-types';
import React from 'react';
import tasks from '../tasks';
import getSubjectLocation from '../../lib/get-subject-location';

export default class TextRenderer extends React.Component {

  render() {
    let taskDescription;
    let InsideSubject;
    const { src } = getSubjectLocation(this.props.subject, this.props.frame);

    if (this.props.annotation.task) {
      taskDescription = this.props.workflow.tasks[this.props.annotation.task];
      (({ InsideSubject } = tasks[taskDescription.type]));
    }


    const hookProps = {
      taskTypes: tasks,
      workflow: this.props.workflow,
      task: taskDescription,
      annotation: this.props.annotation,
      annotations: this.props.annotations,
      frame: this.props.frame,
      onChange: this.props.onChange,
      preferences: this.props.preferences
    };

    let children = [];
    const isTextTask = taskDescription && (tasks[taskDescription.type].AnnotationRenderer === TextRenderer);
    const persistentHooks = this.props.annotations
      .map(annotation => this.props.workflow.tasks[annotation.task])
      .filter(task => tasks[task.type].AnnotationRenderer === TextRenderer)
      .map((task, i) => {
        const { PersistInsideSubject } = tasks[task.type];
        const filteredAnnotations = this.props.annotations.filter((annotation) => {
          const currentTask = this.props.workflow.tasks[annotation.task];
          return tasks[currentTask.type].AnnotationRenderer === TextRenderer;
        });
        if (PersistInsideSubject) {
          return (
            <PersistInsideSubject
              key={task.type}
              src={src}
              {...hookProps}
              annotation={filteredAnnotations[i]}
            >
              {this.props.children}
            </PersistInsideSubject>
          );
        }
        return null;
      })
      .filter(Boolean);
    children = children.concat(persistentHooks);
    if (isTextTask && InsideSubject) {
      children = <InsideSubject key="inside" src={src} {...hookProps}>{children}</InsideSubject>;
    }
    if (children.length === 0) {
      (({ children } = this.props));
    }

    return (
      <div className="frame-annotator">
        {children}
      </div>
    );
  }
}

TextRenderer.propTypes = {
  annotation: PropTypes.shape({
    task: PropTypes.string
  }),
  annotations: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  frame: PropTypes.number,
  onChange: PropTypes.func,
  preferences: PropTypes.object,
  subject: PropTypes.shape({
    already_seen: PropTypes.bool,
    retired: PropTypes.bool
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

TextRenderer.defaultProps = {
  user: null,
  project: null,
  subject: null,
  workflow: null,
  classification: null,
  annotation: null,
  onLoad: () => {},
  frame: 0,
  onChange: () => {}
};