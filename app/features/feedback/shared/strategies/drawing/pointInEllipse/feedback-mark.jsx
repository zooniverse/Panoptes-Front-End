import PropTypes from 'prop-types';
import React from 'react';

function FeedbackMark({ rule }) {
  const color = (rule.success) ? 'green' : 'red';
  const transform = `rotate(${-rule.theta}, ${rule.x}, ${rule.y}) translate(${rule.x}, ${rule.y})`;
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={0.5*rule.a}
      ry={0.5*rule.b}
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
    a: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    b: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    r1: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    r2: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
    theta: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number]),
  }).isRequired
};

export default FeedbackMark;
