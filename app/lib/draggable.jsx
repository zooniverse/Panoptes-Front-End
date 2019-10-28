import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function Draggable(props) {
  let _previousEventCoords = {};
  let moveEvent;
  let endEvent;
  const rootElement = document.querySelector('#panoptes-main-container') || document.body;

  function _rememberCoords(e) {
    _previousEventCoords = {
      x: e.pageX,
      y: e.pageY
    };
  }

  function cancelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleStart(e) {
    const multiTouch = e.touches && e.touches.length > 1;

    if (!multiTouch) {
      e.preventDefault();

      switch (e.type) {
        case 'mousedown':
          [moveEvent, endEvent] = ['mousemove', 'mouseup'];
          break;
        case 'touchstart':
          [moveEvent, endEvent] = ['touchmove', 'touchend'];
          break;
        default:
          [moveEvent, endEvent] = ['pointermove', 'pointerup'];
      }

      const eventCoords = (e.touches && e.touches[0]) ? e.touches[0] : e;
      _rememberCoords(eventCoords);

      // Prefix with this class to switch from `cursor:grab` to `cursor:grabbing`.
      rootElement.classList.add('dragging');

      rootElement.addEventListener(moveEvent, handleDrag);
      rootElement.addEventListener(endEvent, handleEnd);

      // If there's no `onStart`, `onDrag` will be called on start.
      const startHandler = props.onStart || handleDrag;
      if (startHandler) { // You can set it to `false` if you don't want anything to fire.
        startHandler(eventCoords);
      }
    }
    return false;
  }

  function handleDrag(e) {
    const multiTouch = e.touches && e.touches.length > 1;
    if (!multiTouch) {
      if (e.type && e.type === moveEvent) {
        cancelEvent(e);
      }
      const eventCoords = (e.touches && e.touches[0]) ? e.touches[0] : e;
      const d = {
        x: eventCoords.pageX - _previousEventCoords.x,
        y: eventCoords.pageY - _previousEventCoords.y
      };
      props.onDrag(eventCoords, d);
      _rememberCoords(eventCoords);
    }
  }

  function handleEnd(e) {
    const multiTouch = e.touches && e.touches.length > 1;
    if (!multiTouch) {
      const eventCoords = (e.touches && e.touches[0]) ? e.touches[0] : e;

      rootElement.removeEventListener(moveEvent, handleDrag);
      rootElement.removeEventListener(endEvent, handleEnd);

      props.onEnd(eventCoords);
      _previousEventCoords = {};
      rootElement.classList.remove('dragging');
    }
  }

  const { children, disabled, usePointer } = props;
  const className = classnames({
    [children.props.className]: true,
    draggable: true
  });
  const childProps = {
    className,
    'data-disabled': disabled ? true : undefined,
    onMouseDown: (!disabled && !usePointer) ? handleStart : undefined,
    onTouchStart: (!disabled && !usePointer) ? handleStart : undefined,
    onPointerDown: (!disabled && usePointer) ? handleStart : undefined
  };
  return React.cloneElement(children, childProps);
}

Draggable.propTypes = {
  onStart: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool
  ]),
  onDrag: PropTypes.func,
  onEnd: PropTypes.func,
  disabled: PropTypes.bool,
  usePointer: PropTypes.bool
};

Draggable.defaultProps = {
  onStart: false,
  onDrag: () => false,
  onEnd: () => false,
  disabled: false,
  usePointer: !!window.PointerEvent
};

export default React.memo(Draggable);
export { Draggable };

