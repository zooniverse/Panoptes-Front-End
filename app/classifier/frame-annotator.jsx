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
      alreadySeen: false,
      showWarning: false
    };
  }

  componentDidMount() {
    this.setState({ alreadySeen: this.props.subject.already_seen || seenThisSession.check(this.props.workflow, this.props.subject) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotation !== this.props.annotation)
      this.handleAnnotationChange(this.props.annotation, nextProps.annotation)
  }

  handleAnnotationChange(oldAnnotation, currentAnnotation) {
    if (oldAnnotation) {
      const lastTask = this.props.workflow.tasks[oldAnnotation.task];
      const LastTaskComponent = tasks[lastTask.type];
      if (LastTaskComponent.onLeaveAnnotation !== undefined) {
        LastTaskComponent.onLeaveAnnotation(lastTask, oldAnnotation);
      }
    }
  }

  getSizeRect() {
    const clientRect = this.refs.sizeRect && this.refs.sizeRect.getBoundingClientRect();

    if (clientRect) {
      const {left, right, top, bottom, width, height} = clientRect;
      left += pageXOffset
      right += pageXOffset
      top += pageYOffset
      bottom += pageYOffset
      return {left, right, top, bottom, width, height}
    }
    return null;
  }

  getScale() {
    const sizeRect = this.getSizeRect();
    const horizontal = sizeRect ? sizeRect.width / this.props.naturalWidth : 0;
    const vertical = sizeRect ? sizeRect.height / this.props.naturalHeight : 0;

    return {horizontal, vertical};
  }

  // get current transformation matrix
  getScreenCurrentTransformationMatrix() {
    const svg = this.refs.svgSubjectArea;
    return svg.getScreenCTM();
  }

  // transforms the event coordinates
  // to points in the SVG coordinate system
  eventCoordsToSVGCoords(x, y) {
    const svg = this.refs.svgSubjectArea;
    const newPoint = svg.createSVGPoint();
    newPoint.x = x;
    newPoint.y = y;
    const matrixForWindowCoordsToSVGUserSpaceCoords = this.getMatrixForWindowCoordsToSVGUserSpaceCoords();
    return newPoint.matrixTransform(matrixForWindowCoordsToSVGUserSpaceCoords);
  }

  // find the original matrix for the SVG coordinate system
  getMatrixForWindowCoordsToSVGUserSpaceCoords() {
    transformationContainer = this.refs.transformationContainer;
    transformationContainer.getScreenCTM().inverse();
  }

  // transforms the difference between two event coordinates
  // into the difference as represent in the SVG coordinate system
  normalizeDifference(e, d) {
    const difference = {}
    const normalizedPoint1 = this.eventCoordsToSVGCoords(e.pageX - d.x, e.pageY - d.y);
    const normalizedPoint2 = this.eventCoordsToSVGCoords(e.pageX, e.pageY);
    difference.x =  normalizedPoint2.x - normalizedPoint1.x;
    difference.y =  normalizedPoint2.y - normalizedPoint1.y;
    return difference;
  }

  // get the offset of event coordiantes in terms of the SVG coordinate system
  getEventOffset(e) {
    return eventCoordsToSVGCoords(e.clientX, e.clientY);
  }

  render() {
    let warningBanner;
    let taskDescription;
    let TaskComponent;

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
      )
    } else if (this.props.subject.retired) {
      warningBanner = (
        <WarningBanner label="Finished!">
          <p>This subject already has enough classifications, so yours won’t be used in its analysis!</p>
          <p>If you’re looking to help, try choosing a different workflow or contributing to a different project.</p>
        </WarningBanner>
    )}

    const {type, format, src} = getSubjectLocation(this.props.subject, this.props.frame);
    const createdViewBox = `${this.props.viewBoxDimensions.x} ${this.props.viewBoxDimensions.y} ${this.props.viewBoxDimensions.width} ${this.props.viewBoxDimensions.height}`;

    const svgStyle = {}
    if (type === 'image' && !props.loading) {
      // Images are rendered again within the SVG itself.
      // When cropped right next to the edge of the image,
      // the original tag can show through, so fill the SVG to cover it.
      svgStyle.background = 'black';

      // Allow touch scrolling on subject for mobile and tablets
      if (taskDescription) {
        unless (taskDescription.type === 'drawing' || taskDescription.type === 'crop')
          svgStyle.pointerEvents = 'none';
      }
      if (this.props.panEnabled === true) {
        svgStyle.pointerEvents = 'all';
      }
    }

    const svgProps = {};

    if (TaskComponent) {
      const {BeforeSubject, InsideSubject, AfterSubject} = TaskComponent;
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
    }

    for (const task in tasks) {
      const Component = tasks[task];
      if (Component.getSVGProps !== null) {
        const ref = Component.getSVGProps(hookProps);
        for (const key in ref) {
          const value = ref[key];
          svgProps[key] = value;
        }
      }
    }

    return (
      <div className="frame-annotator">
        <div className="subject-area">

          {BeforeSubject && (
            <BeforeSubject {...hookProps} />)}

            <svg ref="svgSubjectArea" className="subject" style={svgStyle} viewBox={createdViewBox} {...svgProps}>
              <g ref="transformationContainer" transform={this.props.transform}>
                <rect ref="sizeRect" width={this.props.naturalWidth} height={this.props.naturalHeight} fill="rgba(0, 0, 0, 0.01)" fillOpacity="0.01" stroke="none" />
                {type === 'image' && (
                  <Draggable onDrag={this.props.panByDrag} disabled={this.props.disabled}>
                    <SVGImage className={this.props.panEnabled ? "pan-active" : ''} src={src} width={this.props.naturalWidth} height={this.props.naturalHeight} modification={this.props.modification} />
                  </Draggable>
                )}

              {(InsideSubject && !this.props.panEnabled) && (
                <InsideSubject {...hookProps} />
              )}

              {tasks.map((anyTaskName) => {
                const PersistInsideSubject = tasks[anyTaskName];
                if (PersistInsideSubject) {
                  return <PersistInsideSubject key={anyTaskName} {...hookProps} />;
                }
              })}

              </g>
            </svg>

            {this.props.children}

            {WarningBanner && (
              WarningBanner
            )}

            {AfterSubject && (
              <AfterSubject {...hookProps} />)}
            </div>
          </div>
    )
  }
}

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
