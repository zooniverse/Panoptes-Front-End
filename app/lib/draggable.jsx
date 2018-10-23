import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Draggable(props) {
  let _previousEventCoords = {};

  function _rememberCoords(e) {
    _previousEventCoords = {
      x: e.pageX,
      y: e.pageY
    };
  }

  function handleStart(e) {
    e.preventDefault();

    let moveEvent;
    let endEvent;

    switch (e.type) {
      case 'mousedown':
        [moveEvent, endEvent] = ['mousemove', 'mouseup'];
        break;
      case 'touchstart':
        [moveEvent, endEvent] = ['touchmove', 'touchend'];
        break;
      default:
        [moveEvent, endEvent] = ['pointermove', 'pointerend'];
    }

    e = (e.touches && e.touches[0]) ? e.touches[0] : e;
    _rememberCoords(e);

    // Prefix with this class to switch from `cursor:grab` to `cursor:grabbing`.
    document.body.classList.add('dragging');

    addEventListener(moveEvent, handleDrag);
    addEventListener(endEvent, handleEnd);

    // If there's no `onStart`, `onDrag` will be called on start.
    const startHandler = props.onStart || handleDrag;
    if (startHandler) { // You can set it to `false` if you don't want anything to fire.
      startHandler(e);
    }
  }

  function handleDrag(e) {
    e = (e.touches && e.touches[0]) ? e.touches[0] : e;
    const d = {
      x: e.pageX - _previousEventCoords.x,
      y: e.pageY - _previousEventCoords.y
    };
    props.onDrag(e, d);
    _rememberCoords(e);
  }

  function handleEnd(e) {
    let moveEvent;
    let endEvent;

    switch (e.type) {
      case 'mouseup':
        [moveEvent, endEvent] = ['mousemove', 'mouseup'];
        break;
      case 'touchstart':
        [moveEvent, endEvent] = ['touchmove', 'touchend'];
        break;
      default:
        [moveEvent, endEvent] = ['pointermove', 'pointerend'];
    }

    e = (e.touches && e.touches[0]) ? e.touches[0] : e;

    removeEventListener(moveEvent, handleDrag);
    removeEventListener(endEvent, handleEnd);

    props.onEnd(e);
    _previousEventCoords = {};
    document.body.classList.remove('dragging');
  }

  const { children, disabled } = props;
  const className = classnames({
    [children.props.className]: true,
    draggable: true
  });
  const childProps = {
    className,
    'data-disabled': disabled ? true : undefined,
    onMouseDown: disabled ? undefined : handleStart,
    onTouchStart: disabled ? undefined : handleStart
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
  disabled: PropTypes.bool
};

Draggable.defaultProps = {
  onStart: false,
  onDrag: () => false,
  onEnd: () => false,
  disabled: false
};
