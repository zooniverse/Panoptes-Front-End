import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? 'green' : 'red';
  const transform = `rotate(${rule.theta}, 0, 0)`
  return (
    <ellipse
      cx={rule.x}
      cy={rule.y}
      r1={rule.a}
      r2={rule.b}
      transform={transform}
      stroke={color}
      fill={color}
      fillOpacity="0.5"
      strokeOpacity="0.8"
    />
  );
}

FeedbackMark.propTypes = {
  rule: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    a: PropTypes.string,
    b: PropTypes.string,
    r1: PropTypes.string,
    r2: PropTypes.string,
    theta: PropTypes.string,
    tolerance: PropTypes.string
  }).isRequired
};

export default FeedbackMark;
