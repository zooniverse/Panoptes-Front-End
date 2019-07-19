import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? 'green' : 'red';
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
