import React from 'react';

class ProgressIndicator extends React.Component {

  progressAsPercentString() {
    // TODO: Implement correct range handling.
    return `${100 * (this.props.progressPosition / this.props.progressRange[1])}%`;
  }

  renderProgressMarker() {
    const progressString = this.progressAsPercentString();
    const points = {
      x1: progressString,
      y1: '0%',
      x2: progressString,
      y2: '100%'
    };

    const progressMarkerStyle = {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2
    };

    // console.log(points);

    return (
      <svg
        className="progress-marker"
        viewBox={`0 0 ${this.props.naturalWidth} ${this.props.naturalHeight}`}
      >
        <image
          xlinkHref={this.props.src}
          width={this.props.naturalWidth}
          height={this.props.naturalHeight}
        />
        <g {...progressMarkerStyle}>
          <line {...points} />
        </g>
      </svg>
    );
  }

  render() {
    return (
      <div>
        {this.renderProgressMarker()}
        {this.props.children}
      </div>
    );
  }

}

ProgressIndicator.propTypes = {
  children: React.PropTypes.node,
  naturalHeight: React.PropTypes.number,
  naturalWidth: React.PropTypes.number,
  progressPosition: React.PropTypes.number,
  progressRange: React.PropTypes.arrayOf(React.PropTypes.number),
  src: React.PropTypes.string.isRequired
};

ProgressIndicator.defaultProps = {
  children: null,
  naturalHeight: 0,
  naturalWidth: 0,
  progressPosition: 0,
  progressRange: [0, 1]
};

export default ProgressIndicator;
