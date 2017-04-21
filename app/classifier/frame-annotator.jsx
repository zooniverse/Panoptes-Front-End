import React from 'react';
import tasks from './tasks';
import seenThisSession from '../lib/seen-this-session';
import getSubjectLocation from '../lib/get-subject-location';
import WarningBanner from './warning-banner';
import AnnotationRenderer from './annotation-renderer/';

export default class FrameAnnotator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadySeen: false,
      showWarning: false
    };
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  componentWillMount() {
    this.setState({ alreadySeen: this.props.subject.already_seen || seenThisSession.check(this.props.workflow, this.props.subject) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotation !== this.props.annotation) {
      this.handleAnnotationChange(this.props.annotation, nextProps.annotation);
    }
    if (nextProps.subject !== this.props.subject) {
      this.setState({ alreadySeen: nextProps.subject.already_seen || seenThisSession.check(nextProps.workflow, nextProps.subject) });
    }
  }

  handleAnnotationChange(oldAnnotation, currentAnnotation) {
    if (oldAnnotation) {
      const lastTask = this.props.workflow.tasks[oldAnnotation.task];
      const LastTaskComponent = tasks[lastTask.type];
      if (LastTaskComponent.onLeaveAnnotation) {
        return LastTaskComponent.onLeaveAnnotation(lastTask, oldAnnotation);
      }
    }
  }

  render() {
    let warningBanner;
    let taskDescription;
    let TaskComponent;
    let BeforeSubject;
    let InsideSubject;
    let AfterSubject;
    const { type, src } = getSubjectLocation(this.props.subject, this.props.frame);

    if (this.props.annotation) {
      taskDescription = this.props.workflow.tasks[this.props.annotation.task];
      TaskComponent = tasks[taskDescription.type];
      ({BeforeSubject, InsideSubject, AfterSubject} = TaskComponent);
    }

    if (this.state.alreadySeen) {
      warningBanner = (
        <WarningBanner label="Already seen!">
          <p>Our records show that you’ve already seen this image. We might have run out of data for you in this workflow!</p>
          <p>Try choosing a different workflow or contributing to a different project.</p>
        </WarningBanner>
      );
    } else if (this.props.subject.retired) {
      warningBanner = (
        <WarningBanner label="Finished!">
          <p>This subject already has enough classifications, so yours won’t be used in its analysis!</p>
          <p>If you’re looking to help, try choosing a different workflow or contributing to a different project.</p>
        </WarningBanner>
      );
    }

    const hookProps = {
      taskTypes: tasks,
      workflow: this.props.workflow,
      task: taskDescription,
      classification: this.props.classification,
      annotation: this.props.annotation,
      frame: this.props.frame,
      naturalWidth: this.props.naturalWidth,
      naturalHeight: this.props.naturalHeight,
      onChange: this.props.onChange,
      preferences: this.props.preferences
    };

    let subjectChildren = [];
    if (!!InsideSubject && !this.props.panEnabled) {
      subjectChildren.push(<InsideSubject key="inside" {...hookProps} />);
    }
    const persistentHooks = Object
      .keys(tasks)
      .map((taskName) => {
        const PersistInsideSubject = tasks[taskName].PersistInsideSubject;
        if (PersistInsideSubject) {
          return <PersistInsideSubject key={taskName} {...hookProps} />;
        }
      })
      .filter(Boolean);
    subjectChildren = subjectChildren.concat(persistentHooks);

    return (
      <div className="frame-annotator">
        <div className="subject-area">

          {!!BeforeSubject && (
            <BeforeSubject {...hookProps} />)}

          <AnnotationRenderer type={type} {...this.props}>
            {subjectChildren}
          </AnnotationRenderer>

          {this.props.children}

          {!!warningBanner && (
            warningBanner
          )}

          {!!AfterSubject && (
            <AfterSubject {...hookProps} />)}
        </div>
      </div>
    );
  }
}

FrameAnnotator.propTypes = {
  annotation: React.PropTypes.shape({
    task: React.PropTypes.string
  }),
  children: React.PropTypes.object,
  classification: React.PropTypes.shape({
    annotations: React.PropTypes.array,
    loading: React.PropTypes.bool
  }),
  disabled: React.PropTypes.bool,
  frame: React.PropTypes.number,
  loading: React.PropTypes.bool,
  modification: React.PropTypes.object,
  naturalHeight: React.PropTypes.number,
  naturalWidth: React.PropTypes.number,
  onChange: React.PropTypes.func,
  panByDrag: React.PropTypes.func,
  panEnabled: React.PropTypes.bool,
  preferences: React.PropTypes.object,
  subject: React.PropTypes.shape({
    already_seen: React.PropTypes.bool,
    retired: React.PropTypes.bool
  }),
  transform: React.PropTypes.string,
  viewBoxDimensions: React.PropTypes.shape({
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    x: React.PropTypes.number,
    y: React.PropTypes.number
  }),
  workflow: React.PropTypes.shape({
    tasks: React.PropTypes.object
  })
};

FrameAnnotator.defaultProps = {
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
