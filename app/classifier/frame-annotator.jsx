import PropTypes from 'prop-types';
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

  handleAnnotationChange(oldAnnotation) {
    if (oldAnnotation) {
      const lastTask = this.props.workflow.tasks[oldAnnotation.task];
      if (lastTask) {
        const LastTaskComponent = tasks[lastTask.type];
        if (LastTaskComponent.onLeaveAnnotation) {
          LastTaskComponent.onLeaveAnnotation(lastTask, oldAnnotation);
        }
      }
    }
  }

  render() {
    let warningBanner;
    let taskDescription;
    let BeforeSubject;
    let AfterSubject;
    const { type } = getSubjectLocation(this.props.subject, this.props.frame);

    if (this.props.annotation.task) {
      taskDescription = this.props.workflow.tasks[this.props.annotation.task];
      (({ BeforeSubject, AfterSubject } = tasks[taskDescription.type]));
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
      annotation: this.props.annotation,
      annotations: this.props.annotations,
      frame: this.props.frame,
      naturalWidth: this.props.naturalWidth,
      naturalHeight: this.props.naturalHeight,
      onChange: this.props.onChange,
      preferences: this.props.preferences
    };
    const childrenWithRenderProps = React.Children.map(
      this.props.children,
      child => React.cloneElement(
        child,
        type === 'application' ? {
          viewBoxDimensions: this.props.viewBoxDimensions
        } : {}
      )
    );
    const rendererProps = Object.assign({}, this.props);
    delete rendererProps.children;

    return (
      <div className="frame-annotator">
        <div className="subject-area">

          {!!BeforeSubject && (
            <BeforeSubject {...hookProps} />)}

          <AnnotationRenderer type={type} {...rendererProps}>
            {childrenWithRenderProps}
          </AnnotationRenderer>

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
  annotation: PropTypes.shape({
    task: PropTypes.string
  }),
  children: PropTypes.node,
  classification: PropTypes.shape({
    annotations: PropTypes.array,
    loading: PropTypes.bool
  }),
  frame: PropTypes.number,
  naturalHeight: PropTypes.number,
  naturalWidth: PropTypes.number,
  onChange: PropTypes.func,
  preferences: PropTypes.shape({
    id: PropTypes.string
  }),
  subject: PropTypes.shape({
    already_seen: PropTypes.bool,
    retired: PropTypes.bool
  }),
  viewBoxDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

FrameAnnotator.defaultProps = {
  user: null,
  project: null,
  subject: null,
  workflow: null,
  classification: null,
  annotation: {},
  onLoad: () => {},
  frame: 0,
  onChange: () => {},
  panEnabled: false
};
