import PropTypes from 'prop-types';
import React from 'react';

const RestartButton = ({ children, className, start, shouldRender, style }) => {
  if (shouldRender) {
    return (
      <button type="button" className={className} style={style} onClick={start}>
        {children}
      </button>
    );
  } else {
    return null;
  }
};

RestartButton.defaultProps = {
  className: null,
  shouldRender: true,
  style: null,
  user: null,
  workflow: null
};

RestartButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  start: PropTypes.func,
  shouldRender: PropTypes.bool,
  style: PropTypes.object,
  user: PropTypes.object,
  workflow: PropTypes.object
};

export default RestartButton;
