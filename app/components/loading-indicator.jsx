import React from 'react';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ children, off }) => {
  const visibility = off ? 'hidden' : 'visible';
  return (
    <span className="loading-indicator" style={{ visibility }}>
      <span className="loading-indicator-icon" />{' '}
      {children}
    </span>
  );
};

LoadingIndicator.propTypes = {
  children: PropTypes.node,
  off: PropTypes.bool
};

LoadingIndicator.defaultProps = {
  children: null,
  off: false
};

export default LoadingIndicator;
