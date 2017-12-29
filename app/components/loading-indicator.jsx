import React from 'react';

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
  children: React.PropTypes.node,
  off: React.PropTypes.bool
};

LoadingIndicator.defaultProps = {
  off: false
};

export default LoadingIndicator;
