import PropTypes from 'prop-types';
import React from 'react';
import ModalFocus from './modal-focus';

// NOTE: This component probably shouldn't be used directly.
// See the function at ../lib/alert.

class Dialog extends React.Component {
  constructor() {
    super();
    this.state = {
      scrollable: false
    };
  }

  componentDidMount() {
    const scrollable = this.content.scrollHeight > this.wrapper.clientHeight;
    this.setState({ scrollable });
  }
  
  componentDidUpdate() {
    if (this.state.scrollable) {
      this.content.focus();
    }
  }

  render() {
    return (
      <ModalFocus className="dialog-underlay" onEscape={this.props.onEscape}>
        <div
          role="dialog"
          className="dialog"
          ref={(element) => { this.wrapper = element; }}
        >
          <div className="dialog-controls">
            <div className="wrapper">{this.props.controls}</div>
          </div>
          <div
            className="dialog-content"
            ref={(element) => { this.content = element; }}
            tabIndex={this.state.scrollable ? 0 : undefined}
          >
            <div className="wrapper" >
              {this.props.children}
            </div>
          </div>
        </div>
      </ModalFocus>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.node,
  controls: PropTypes.node,
  onEscape: PropTypes.func
};

Dialog.defaultProps = {
  children: null,
  controls: null,
  onEscape: () => {}
};

export default Dialog;