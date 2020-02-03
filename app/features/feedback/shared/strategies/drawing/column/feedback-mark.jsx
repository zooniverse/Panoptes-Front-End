import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? (rule.falsePosMode ? 'red' : 'green') : 'red';
  const fillOpacities = (rule.falsePosMode && !rule.success) ? [0, 0] : [0.2, 0.5];
  const strokeOpacities = (rule.falsePosMode && !rule.success) ? [0, 0] : [0.6, 0.8];
  const tolerance = parseInt(rule.tolerance, 10);
  return (
    <g>
      <rect
        x={parseInt(rule.x, 10) - tolerance}
        y={0}
        width={parseInt(rule.width, 10) + (tolerance * 2)}
        height="100%"
        stroke="blue"
        fill="blue"
        fillOpacity={fillOpacities[0]}
        strokeOpacity={strokeOpacities[0]}
      />
      <rect
        x={rule.x}
        y={0}
        width={rule.width}
        height="100%"
        stroke={color}
        fill={color}
        fillOpacity={fillOpacities[1]}
        strokeOpacity={strokeOpacities[1]}
      />
    </g>
  );
}

FeedbackMark.propTypes = {
  rule: PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]).isRequired,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]).isRequired,
    tolerance: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]).isRequired
  }).isRequired
};

export default FeedbackMark;
