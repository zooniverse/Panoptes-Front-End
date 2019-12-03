import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? 'green' : 'red';
  const floatTheta = parseFloat(rule.theta);
  const transform = `rotate(${-floatTheta}, ${rule.x}, ${rule.y}) translate(${rule.x}, ${rule.y})`;
  const rx = 0.5*parseFloat(rule.toleranceA);
  const ry = 0.5*parseFloat(rule.toleranceB);
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={rx}
      ry={ry}
      transform={transform}
      stroke={color}
      fill={color}
      fillOpacity="0.3"
      strokeOpacity="0.8"
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
  }).isRequired
};

export default FeedbackMark;
