import React from 'react';

class ProgressIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  progressAsPercentString() {
    // TODO: Implement correct range handling.
    return `${ 100 * (this.props.progressPosition / this.props.progressRange[1])}%`
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
      <svg>
        <g id='progress_marker' {...progressMarkerStyle}>
          <line {...points}/>
        </g>
      </svg>
    )
  }

  render() {
    return ( <div className='progress-marker'>
      {this.renderProgressMarker()}
      {this.props.children}
      </div>
    );
  }

}

ProgressIndicator.propTypes = {
  children: React.PropTypes.node,
  progressPosition: React.PropTypes.number,
  progressRange: React.PropTypes.array,
  naturalWidth: React.PropTypes.number,
  naturalHeight: React.PropTypes.number,
  frame: React.PropTypes.number
};

ProgressIndicator.defaultProps = {
  progressPosition : 0,
  progressRange : [0, 1],
  naturalWidth : '100%',
  naturalHeight : '100%'
};

export default ProgressIndicator;
