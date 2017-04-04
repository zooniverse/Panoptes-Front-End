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

RestartButton.contextTypes = {
  geordi: React.PropTypes.object
};

RestartButton.defaultProps = {
  className: null,
  shouldRender: true,
  style: null,
  user: null,
  workflow: null
};

RestartButton.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  start: React.PropTypes.func,
  shouldRender: React.PropTypes.bool,
  style: React.PropTypes.object,
  user: React.PropTypes.object,
  workflow: React.PropTypes.object
};

export default RestartButton;
