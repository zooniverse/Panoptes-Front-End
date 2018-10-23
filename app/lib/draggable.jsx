import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Draggable extends React.Component {
  constructor() {
    super();
    this._previousEventCoords = {};
  }

  _rememberCoords(e) {
    this._previousEventCoords = {
      x: e.pageX,
      y: e.pageY
    };
  }

  handleStart(e) {
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
    this._rememberCoords(e);

    // Prefix with this class to switch from `cursor:grab` to `cursor:grabbing`.
    document.body.classList.add('dragging');

    addEventListener(moveEvent, this.handleDrag.bind(this));
    addEventListener(endEvent, this.handleEnd.bind(this));

    // If there's no `onStart`, `onDrag` will be called on start.
    const startHandler = this.props.onStart || this.handleDrag;
    if (startHandler) { // You can set it to `false` if you don't want anything to fire.
      startHandler(e);
    }
  }

  handleDrag(e) {
    e = (e.touches && e.touches[0]) ? e.touches[0] : e;
    const d = {
      x: e.pageX - this._previousEventCoords.x,
      y: e.pageY - this._previousEventCoords.y
    };
    this.props.onDrag(e, d);
    this._rememberCoords(e);
  }

  handleEnd(e) {
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

    removeEventListener(moveEvent, this.handleDrag.bind(this));
    removeEventListener(endEvent, this.handleEnd.bind(this));

    this.props.onEnd(e);
    this._previousEventCoords = null;
    document.body.classList.remove('dragging');
  }

  render() {
    const { children, disabled } = this.props;
    const className = classnames({
      [children.props.className]: true,
      draggable: true
    });
    const childProps = {
      className,
      'data-disabled': disabled,
      onMouseDown: disabled ? undefined : this.handleStart.bind(this),
      onTouchStart: disabled ? undefined : this.handleStart.bind(this)
    };
    return React.cloneElement(children, childProps);
  }
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
