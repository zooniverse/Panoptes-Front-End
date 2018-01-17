import PropTypes from 'prop-types';
import React from 'react';

const FeedbackPoint = ({ point }) => {
  const statusClass = (point.success) ? 'feedback-points__point--success' : 'feedback-points__point--failure';
  const pointProps = {
    className: `feedback-points__point ${statusClass}`,
    cx: point.x,
    cy: point.y,
    r: point.tol
  };
  return <circle {...pointProps} />;
};

FeedbackPoint.propTypes = {
  point: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    tol: PropTypes.string,
    success: PropTypes.bool
  })
};

export default FeedbackPoint;