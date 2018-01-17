import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const FOCUSABLES = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[contenteditable]';

const ESC_KEY = 27;
const TAB_KEY = 9;

class ModalFocus extends React.Component {
  constructor(props) {
    super(props);
    this.previousActiveElement = document.activeElement;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    !!this.props.preserveFocus && !!this.previousActiveElement && this.previousActiveElement.focus();
  }

  handleKeyDown(e) {
    const { shiftKey, target } = e;
    const focusables = ReactDOM.findDOMNode(this).querySelectorAll(FOCUSABLES);
    switch (e.keyCode) {
      case ESC_KEY:
        this.props.onEscape();
        break;
      case TAB_KEY:
        if (shiftKey && target === focusables[0]) {
          focusables[focusables.length - 1].focus();
          e.preventDefault();
        } else if (!shiftKey && target === focusables[focusables.length - 1]) {
          focusables[0].focus();
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className={this.props.className} onKeyDown={this.handleKeyDown}>
        {this.props.children}
      </div>
    );
  }
}

ModalFocus.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onEscape: PropTypes.func,
  preserveFocus: PropTypes.bool
};

ModalFocus.defaultProps = {
  onEscape: () => null,
  preserveFocus: true
};

export default ModalFocus;