import React from 'react';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ children, off }) => {
  const visibility = off ? 'hidden' : '';
  return (
    <span className="loading-indicator" style={{ visibility }}>
      <span className="loading-indicator-icon"></span>{' '}
      {children}
    </span>
  );
};

LoadingIndicator.propTypes = {
  children: PropTypes.node,
  off: PropTypes.bool
};

LoadingIndicator.defaultProps = {
  off: false
};

export default LoadingIndicator;
