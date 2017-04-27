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
      ({ InsideSubject } = tasks[taskDescription.type]);
    }


    const hookProps = {
      taskTypes: tasks,
      workflow: this.props.workflow,
      task: taskDescription,
      classification: this.props.classification,
      annotation: this.props.annotation,
      frame: this.props.frame,
      onChange: this.props.onChange,
      preferences: this.props.preferences
    };

    let children = [];
    const isTextTask = taskDescription && (tasks[taskDescription.type].AnnotationRenderer === TextRenderer);
    if (isTextTask && InsideSubject) {
      children.push(<InsideSubject key="inside" src={src} {...hookProps}>{this.props.children}</InsideSubject>);
    }
    const persistentHooks = Object
      .keys(tasks)
      .filter((key) => { return tasks[key].AnnotationRenderer === TextRenderer; })
      .map((taskName) => {
        const PersistInsideSubject = tasks[taskName].PersistInsideSubject;
        if (PersistInsideSubject) {
          return <PersistInsideSubject key={taskName} src={src} {...hookProps}>{this.props.children}</PersistInsideSubject>;
        }
        return null;
      })
      .filter(Boolean);
    children = children.concat(persistentHooks);

    return (
      <div className="frame-annotator">
        {children}
      </div>
    );
  }
}

TextRenderer.propTypes = {
  annotation: React.PropTypes.shape({
    task: React.PropTypes.string
  }),
  children: React.PropTypes.node,
  classification: React.PropTypes.shape({
    annotations: React.PropTypes.array,
    loading: React.PropTypes.bool
  }),
  frame: React.PropTypes.number,
  onChange: React.PropTypes.func,
  preferences: React.PropTypes.object,
  subject: React.PropTypes.shape({
    already_seen: React.PropTypes.bool,
    retired: React.PropTypes.bool
  }),
  workflow: React.PropTypes.shape({
    tasks: React.PropTypes.object
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
