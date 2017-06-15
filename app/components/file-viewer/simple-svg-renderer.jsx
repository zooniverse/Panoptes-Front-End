import React from 'react';
import Draggable from '../../lib/draggable';
import tasks from '../tasks';
import getSubjectLocation from '../../lib/get-subject-location';
import SVGImage from '../../components/svg-image';
import SVGFeedbackViewer from '../feedback/svg-feedback-viewer';
import SVGToolTipLayer from '../feedback/svg-tooltip-layer';
import { isFeedbackActive } from '../feedback/helpers';

export default class SVGRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.getScreenCurrentTransformationMatrix = this.getScreenCurrentTransformationMatrix.bind(this);
    this.getEventOffset = this.getEventOffset.bind(this);
    this.normalizeDifference = this.normalizeDifference.bind(this);
    this.eventCoordsToSVGCoords = this.eventCoordsToSVGCoords.bind(this);
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
    const svg = this.svgSubjectArea;
    return svg.getScreenCTM();
  }

  // find the original matrix for the SVG coordinate system
  getMatrixForWindowCoordsToSVGUserSpaceCoords() {
    const { transformationContainer } = this;
    return transformationContainer.getScreenCTM().inverse();
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
    const svg = this.svgSubjectArea;
    const newPoint = svg.createSVGPoint();
    newPoint.x = x;
    newPoint.y = y;
    const matrixForWindowCoordsToSVGUserSpaceCoords = this.getMatrixForWindowCoordsToSVGUserSpaceCoords();
    const pointforSVGSystem = newPoint.matrixTransform(matrixForWindowCoordsToSVGUserSpaceCoords);
    return pointforSVGSystem;
  }

  render() {
    let taskDescription;
    let InsideSubject;
    const { type, src } = getSubjectLocation(this.props.subject, this.props.frame);
    const createdViewBox = `${this.props.viewBoxDimensions.x} ${this.props.viewBoxDimensions.y} ${this.props.viewBoxDimensions.width} ${this.props.viewBoxDimensions.height}`;

    if (this.props.annotation.task) {
      taskDescription = this.props.workflow.tasks[this.props.annotation.task];
      ({ InsideSubject } = tasks[taskDescription.type]);
    }

    const { annotations } = this.props.classification;

    const hookProps = {
      annotations,
      annotation: this.props.annotation,
      classification: this.props.classification,
      containerRect: this.getSizeRect(),
      frame: this.props.frame,
      getEventOffset: this.getEventOffset,
      getScreenCurrentTransformationMatrix: this.getScreenCurrentTransformationMatrix,
      naturalWidth: this.props.naturalWidth,
      naturalHeight: this.props.naturalHeight,
      normalizeDifference: this.normalizeDifference,
      onChange: this.props.onChange,
      preferences: this.props.preferences,
      task: taskDescription,
      tasks: this.props.workflow.tasks,
      scale: this.getScale(),
      taskTypes: tasks,
      workflow: this.props.workflow
    };

    // disable subject pointer events by default.
    // Tasks then need to enable pointer events, when required, in SVGProps.
    const svgProps = {
      style: {
        background: 'black',
        pointerEvents: 'none'
      }
    };

    Object.keys(tasks).map((task) => {
      const Component = tasks[task];
      if (Component.getSVGProps) {
        const { style } = svgProps;
        const newProps = Component.getSVGProps(hookProps);
        const newStyle = newProps ? Object.assign(style, newProps.style) : style;
        svgProps.style = newStyle;
        delete newProps.style;
        Object.assign(svgProps, newProps);
      }
    });

    // pan/zoom should override any custom pointer event styles
    if (this.props.panEnabled === true) {
      svgProps.style.pointerEvents = 'all';
    }

    let children = [];
    const isDrawingTask = taskDescription && (tasks[taskDescription.type].AnnotationRenderer === SVGRenderer);
    if (isDrawingTask && InsideSubject && !this.props.panEnabled) {
      children.push(<InsideSubject key="inside" {...hookProps} />);
    }
    const persistentHooks = Object
      .keys(tasks)
      .filter((key) => { return tasks[key].AnnotationRenderer === SVGRenderer; })
      .map((taskName) => {
        const PersistInsideSubject = tasks[taskName].PersistInsideSubject;
        if (PersistInsideSubject) {
          return <PersistInsideSubject key={taskName} {...hookProps} />;
        }
        return null;
      })
      .filter(Boolean);
    children = children.concat(persistentHooks);

    const showFeedback = isFeedbackActive(this.props.project);

    return (
      <div>
        <svg
          ref={(element) => { if (element) this.svgSubjectArea = element; }}
          className="subject"
          viewBox={createdViewBox}
          {...svgProps}
        >
          <g
            ref={(element) => { if (element) this.transformationContainer = element; }}
            transform={this.props.transform}
          >
            <rect
              ref={(rect) => { this.sizeRect = rect; }}
              width={this.props.naturalWidth}
              height={this.props.naturalHeight}
              fill="rgba(0, 0, 0, 0.01)"
              fillOpacity="0.01"
              stroke="none"
            />
            {type === 'image' && (
              <Draggable onDrag={this.props.panEnabled ? this.props.panByDrag : () => {}}>
                <SVGImage
                  className={this.props.panEnabled ? 'pan-active' : ''}
                  src={src}
                  width={this.props.naturalWidth}
                  height={this.props.naturalHeight}
                  modification={this.props.modification}
                />
              </Draggable>
            )}

            {children}

            {(showFeedback) && (<SVGFeedbackViewer />)}
          </g>
        </svg>
        {(showFeedback) && (<SVGToolTipLayer getScreenCTM={this.getScreenCurrentTransformationMatrix} />)}
      </div>
    );
  }
}

SVGRenderer.propTypes = {
  annotation: React.PropTypes.shape({
    task: React.PropTypes.string
  }),
  classification: React.PropTypes.shape({
    annotations: React.PropTypes.array,
    loading: React.PropTypes.bool
  }),
  frame: React.PropTypes.number,
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

SVGRenderer.defaultProps = {
  annotation: null,
  classification: null,
  frame: 0,
  onChange: () => {},
  onLoad: () => {},
  project: null,
  subject: null,
  user: null,
  workflow: null
};
