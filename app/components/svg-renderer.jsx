import PropTypes from 'prop-types';
import React from 'react';
import Draggable from '../lib/draggable';
import getSubjectLocation from '../lib/get-subject-location';
import SVGImage from './svg-image';
import SVGTransparentRect from './svg-transparent-rect';

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
    let horizontal = this.props.naturalWidth ? sizeRect.width / this.props.naturalWidth : 0.001;
    let vertical = this.props.naturalHeight ? sizeRect.height / this.props.naturalHeight : 0.001;
    horizontal = Math.max(horizontal, 0.001);
    vertical = Math.max(vertical, 0.001);

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
    const { type, src } = getSubjectLocation(this.props.subject, this.props.frame);
    const createdViewBox = `${this.props.viewBoxDimensions.x} ${this.props.viewBoxDimensions.y} ${this.props.viewBoxDimensions.width} ${this.props.viewBoxDimensions.height}`;

    // disable subject pointer events by default.
    // Tasks then need to enable pointer events, when required, in SVGProps.
    const svgProps = {
      style: {}
    };

    // pan/zoom should override any custom pointer event styles
    // if (this.props.panEnabled === true) {
    //   svgProps.style.pointerEvents = 'all';
    // }

    return (
      <div className="frame-annotator">
        <div className={`subject svg-subject ${this.props.type}`}>
          <svg
            ref={(element) => { if (element) this.svgSubjectArea = element; }}
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
              {type === 'image' && this.props.naturalWidth && (
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
              {type === 'application' && this.props.naturalWidth && (
                <Draggable onDrag={this.props.panEnabled ? this.props.panByDrag : () => {}}>
                  <SVGTransparentRect
                    className={this.props.panEnabled ? 'pan-active' : ''}
                    width={this.props.naturalWidth}
                    height={this.props.naturalHeight}
                    modification={this.props.modification}
                  />
                </Draggable>
              )}
            </g>
          </svg>
        </div>
        {this.props.children}
      </div>
    );
  }
}

SVGRenderer.propTypes = {
  annotation: PropTypes.shape({
    task: PropTypes.string
  }),
  annotations: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  frame: PropTypes.number,
  modification: PropTypes.object,
  naturalHeight: PropTypes.number,
  naturalWidth: PropTypes.number,
  onChange: PropTypes.func,
  panByDrag: PropTypes.func,
  panEnabled: PropTypes.bool,
  preferences: PropTypes.object,
  subject: PropTypes.shape({
    already_seen: PropTypes.bool,
    retired: PropTypes.bool
  }),
  transform: PropTypes.string,
  viewBoxDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  }),
  progressMarker: PropTypes.func
};

SVGRenderer.defaultProps = {
  annotation: null,
  annotations: [],
  frame: 0,
  onChange: () => {},
  onLoad: () => {},
  project: null,
  subject: null,
  user: null,
  workflow: null,
  progressMarker: () => {}
};
