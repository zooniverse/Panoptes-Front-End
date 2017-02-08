import React from 'react';
import Draggable from '../lib/draggable';
import tasks from './tasks';
import seenThisSession from '../lib/seen-this-session';
import getSubjectLocation from '../lib/get-subject-location';
import WarningBanner from './warning-banner';
import SVGImage from '../components/svg-image';

export default class FrameAnnotator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadySeen: false
    };
    this.getScreenCurrentTransformationMatrix = this.getScreenCurrentTransformationMatrix.bind(this);
    this.getEventOffset = this.getEventOffset.bind(this);
    this.normalizeDifference = this.normalizeDifference.bind(this);
    this.eventCoordsToSVGCoords = this.eventCoordsToSVGCoords.bind(this);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  componentWillMount() {
    this.setState({ alreadySeen: this.props.subject.already_seen || seenThisSession.check(this.props.workflow, this.props.subject) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotation !== this.props.annotation) {
      this.handleAnnotationChange(this.props.annotation, nextProps.annotation);
    }
  }

  getSizeRect() {
    const clientRect = this.sizeRect && this.sizeRect.getBoundingClientRect();

    if (clientRect) {
      const { width, height } = clientRect;
      let { left, right, top, bottom } = clientRect;
      left += pageXOffset;
      right += pageXOffset;
      top += pageYOffset;
      bottom += pageYOffset;
      return { left, right, top, bottom, width, height };
    }
    return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  }

  getScale() {
    const sizeRect = this.getSizeRect();
    const horizontal = sizeRect ? sizeRect.width / this.props.naturalWidth : 0;
    const vertical = sizeRect ? sizeRect.height / this.props.naturalHeight : 0;

    return { horizontal, vertical };
  }

  // get current transformation matrix
  getScreenCurrentTransformationMatrix() {
    return this.svgSubjectArea.getScreenCTM();
  }

  // find the original matrix for the SVG coordinate system
  getMatrixForWindowCoordsToSVGUserSpaceCoords() {
    return this.transformationContainer.getScreenCTM().inverse();
  }

  // get the offset of event coordiantes in terms of the SVG coordinate system
  getEventOffset(e) {
    return this.eventCoordsToSVGCoords(e.clientX, e.clientY);
  }

  // transforms the difference between two event coordinates
  // into the difference as represent in the SVG coordinate system
  normalizeDifference(e, d) {
    const difference = {};
    const normalizedPoint1 = this.eventCoordsToSVGCoords(e.pageX - d.x, e.pageY - d.y);
    const normalizedPoint2 = this.eventCoordsToSVGCoords(e.pageX, e.pageY);
    difference.x = normalizedPoint2.x - normalizedPoint1.x;
    difference.y = normalizedPoint2.y - normalizedPoint1.y;
    return difference;
  }

  // transforms the event coordinates
  // to points in the SVG coordinate system
  eventCoordsToSVGCoords(x, y) {
    const newPoint = this.svgSubjectArea.createSVGPoint();
    newPoint.x = x;
    newPoint.y = y;
    const matrixForWindowCoordsToSVGUserSpaceCoords = this.getMatrixForWindowCoordsToSVGUserSpaceCoords();
    const pointforSVGSystem = newPoint.matrixTransform(matrixForWindowCoordsToSVGUserSpaceCoords);
    return pointforSVGSystem;
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
    const createdViewBox = `${this.props.viewBoxDimensions.x} ${this.props.viewBoxDimensions.y} ${this.props.viewBoxDimensions.width} ${this.props.viewBoxDimensions.height}`;

    if (this.props.annotation) {
      taskDescription = this.props.workflow.tasks[this.props.annotation.task];
      TaskComponent = tasks[taskDescription.type];
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

    const svgStyle = {};
    if (type === 'image' && !this.props.loading) {
      // Images are rendered again within the SVG itself.
      // When cropped right next to the edge of the image,
      // the original tag can show through, so fill the SVG to cover it.
      svgStyle.background = 'black';

      // Allow touch scrolling on subject for mobile and tablets
      if (taskDescription) {
        if ((taskDescription.type !== 'drawing') && (taskDescription.type !== 'crop')) {
          svgStyle.pointerEvents = 'none';
        }
      }
      if (this.props.panEnabled === true) {
        svgStyle.pointerEvents = 'all';
      }
    }

    const svgProps = {};

    if (TaskComponent) {
      ({ BeforeSubject, InsideSubject, AfterSubject } = TaskComponent);
    }

    const hookProps = {
      taskTypes: tasks,
      workflow: this.props.workflow,
      task: taskDescription,
      classification: this.props.classification,
      annotation: this.props.annotation,
      frame: this.props.frame,
      scale: this.getScale(),
      naturalWidth: this.props.naturalWidth,
      naturalHeight: this.props.naturalHeight,
      containerRect: this.getSizeRect(),
      getEventOffset: this.getEventOffset,
      onChange: this.props.onChange,
      preferences: this.props.preferences,
      normalizeDifference: this.normalizeDifference,
      getScreenCurrentTransformationMatrix: this.getScreenCurrentTransformationMatrix
    };

    Object.keys(tasks).map((task) => {
      const Component = tasks[task];
      if (Component.getSVGProps) {
        Object.assign(svgProps, Component.getSVGProps(hookProps));
      }
    });

    return (
      <div className="frame-annotator">
        <div className="subject-area">

          {!!BeforeSubject && (
            <BeforeSubject {...hookProps} />)}

          <svg ref={(svg) => { this.svgSubjectArea = svg; }} className="subject" style={svgStyle} viewBox={createdViewBox} {...svgProps}>
            <g ref={(g) => { this.transformationContainer = g; }} transform={this.props.transform}>
              <rect ref={(rect) => { this.sizeRect = rect; }} width={this.props.naturalWidth} height={this.props.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />
              {type === 'image' && (
                <Draggable onDrag={this.props.panByDrag} disabled={this.props.disabled}>
                  <SVGImage className={this.props.panEnabled ? 'pan-active' : ''} src={src} width={this.props.naturalWidth} height={this.props.naturalHeight} modification={this.props.modification} />
                </Draggable>
              )}

              {(!!InsideSubject && !this.props.panEnabled) && (
                <InsideSubject {...hookProps} />
              )}

              {Object.keys(tasks).map((taskName) => {
                const PersistInsideSubject = tasks[taskName].PersistInsideSubject;
                if (PersistInsideSubject) {
                  return <PersistInsideSubject key={taskName} {...hookProps} />;
                }
              })}

            </g>
          </svg>

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
