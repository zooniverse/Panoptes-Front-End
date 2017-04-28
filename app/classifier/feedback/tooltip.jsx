import React, { PropTypes } from 'react';

const Tooltip = ({ item, screenCTM }) => {
  const matrix = screenCTM.translate(item.x, item.y);
  const position = {
    left: `${item.x}px`,
    bottom: `${parseInt(item.y, 10) + parseInt(item.tol, 10) + 15}px`,
  }
  return (
    <div
      className={`feedback-tooltip feedback-tooltip--${item.success ? 'success' : 'failure'}`}
      key={`feedback-tooltip-${item.x}-${item.y}`}
      style={position}>
      <div className="feedback-tooltip__content">
        {item.message}
      </div>
      <svg
        className="feedback-tooltip__triangle"
        version="1.1"
        viewBox="0 10 20 15"
        xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 20,0 10,15"/>
      </svg>
    </div>
  );
};

Tooltip.propTypes = {
  item: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    success: PropTypes.bool,
    message: PropTypes.string,
  }),
  screenCTM: PropTypes.shape({
    translate: PropTypes.func,
  }),
};

export default Tooltip;
