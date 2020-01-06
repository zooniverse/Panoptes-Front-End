import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? (rule.falsePosMode ? 'red' : 'green') : 'red';
  const fillOpacity = (rule.falsePosMode && !rule.success) ? 0 : 0.5;
  const strokeOpacity = (rule.falsePosMode && !rule.success) ? 0 : 0.8;
  return (
    <circle
      cx={rule.x}
      cy={rule.y}
      r={rule.tolerance}
      stroke={color}
      fill={color}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
    />
  );
}

FeedbackMark.propTypes = {
  rule: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    tolerance: PropTypes.string,
    falsePosMode: PropTypes.bool,
    success: PropTypes.bool,
  }).isRequired
};

export default FeedbackMark;
