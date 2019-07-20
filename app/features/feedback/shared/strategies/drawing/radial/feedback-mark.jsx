import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? 'yellow' : 'red';
  if(rule.successFailureShapesEnabled){
    if(rule.success){
      return (
        <circle
          cx={rule.x}
          cy={rule.y}
          r={rule.tolerance}
          stroke={color}
          fill={color}
          fillOpacity="0.0"
          strokeOpacity="1.0"
          strokeWidth="3"
        />);
    }
    else{
      return (
        <rect
          x={Number(rule.x) - Number(rule.tolerance)}
          y={Number(rule.y) - Number(rule.tolerance)}
          width={2*Number(rule.tolerance)}
          height={2*Number(rule.tolerance)}
          stroke={color}
          fill={color}
          fillOpacity="0.0"
          strokeOpacity="1.0"
          strokeWidth="3"
        />);
    }
  }
  // fall through
  return (
    <circle
      cx={rule.x}
      cy={rule.y}
      r={rule.tolerance}
      stroke={color}
      fill={color}
      fillOpacity="0.5"
      strokeOpacity="0.8"
    />
  );
}

FeedbackMark.propTypes = {
  rule: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tolerance: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired
};

export default FeedbackMark;
