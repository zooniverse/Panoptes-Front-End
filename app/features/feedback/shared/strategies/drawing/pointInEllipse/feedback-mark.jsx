import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? (rule.falsePosMode ? 'red' : 'green') : 'red';
  const fillOpacity = (rule.falsePosMode && !rule.success) ? 0 : 0.3;
  const strokeOpacity = (rule.falsePosMode && !rule.success) ? 0 : 0.8;

  const floatTheta = parseFloat(rule.theta);
  const transform = `rotate(${-floatTheta}, ${rule.x}, ${rule.y}) translate(${rule.x}, ${rule.y})`;
  const rx = 0.5 * parseFloat(rule.toleranceA);
  const ry = 0.5 * parseFloat(rule.toleranceB);
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={rx}
      ry={ry}
      transform={transform}
      stroke={color}
      fill={color}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
    />
  );
}

FeedbackMark.propTypes = {
  rule: PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    y: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    toleranceA: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    toleranceB: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    theta: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    falsePosMode: PropTypes.bool,
    success: PropTypes.bool
  }).isRequired
};

export default FeedbackMark;
