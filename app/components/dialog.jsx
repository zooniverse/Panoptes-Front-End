import React from 'react';
import ModalFocus from './modal-focus';

// NOTE: This component probably shouldn't be used directly.
// See the function at ../lib/alert.

function Dialog(props) {
  return (
    <ModalFocus className="dialog-underlay" onEscape={props.onEscape}>
      <div role="dialog" className="dialog">
        <div className="dialog-controls">
          <div className="wrapper">{props.controls}</div>
        </div>
        <div className="dialog-content">
          <div className="wrapper">
            {props.children}
          </div>
        </div>
      </div>
    </ModalFocus>
  );
}

Dialog.propTypes = {
  children: React.PropTypes.node,
  controls: React.PropTypes.node,
  onEscape: React.PropTypes.func
};

Dialog.defaultProps = {
  children: null,
  controls: null,
  onEscape: () => {}
};

export default Dialog;

