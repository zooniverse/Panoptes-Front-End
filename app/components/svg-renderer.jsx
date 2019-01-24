import PropTypes from 'prop-types';
import React from 'react';
import getSubjectLocation from '../lib/get-subject-location';
import SVGImage from './svg-image';
import SVGTransparentRect from './svg-transparent-rect';

export default class SVGRenderer extends React.Component {
  render() {
    const { type, src } = getSubjectLocation(this.props.subject, this.props.frame);
    const createdViewBox = `${this.props.viewBoxDimensions.x} ${this.props.viewBoxDimensions.y} ${this.props.viewBoxDimensions.width} ${this.props.viewBoxDimensions.height}`;

    return (
      <div className="frame-annotator">
        <div className={`subject svg-subject ${this.props.type}`}>
          <svg
            ref={(element) => { if (element) this.svgSubjectArea = element; }}
            viewBox={createdViewBox}
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
                <SVGImage
                  src={src}
                  width={this.props.naturalWidth}
                  height={this.props.naturalHeight}
                  modification={this.props.modification}
                />
              )}
              {type === 'application' && this.props.naturalWidth && (
                <SVGTransparentRect
                  width={this.props.naturalWidth}
                  height={this.props.naturalHeight}
                  modification={this.props.modification}
                />
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
  children: PropTypes.node,
  frame: PropTypes.number,
  modification: PropTypes.object,
  naturalHeight: PropTypes.number,
  naturalWidth: PropTypes.number,
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
  })
};

SVGRenderer.defaultProps = {
  frame: 0,
  subject: null
};
