import React from 'react';

class RestartButton extends React.Component {
  constructor(props) {
    super(props);
  }

  getCallback() {
    // override in sub-class
    return () => {};
  }

  shouldRender() {
    // override in sub-class
    return true;
  }

  render() {
    // state and props are passed into getCallback and shouldRender
    // to avoind binding a sub-class function to the parent class `this`
    const onClick = this.getCallback(this.state, this.props, this.context);
    const {className, style} = this.props;
    if (this.shouldRender(this.state, this.props)) {
      return (
        <button type="button" className={className} style={style} onClick={onClick}>
          {this.props.children}
        </button>
      );
    } else {
      return null;
    }
  }
}

RestartButton.contextTypes = {
  geordi: React.PropTypes.object
}

RestartButton.defaultProps = {
  workflow: null,
  project: null,
  user: null,
  dialog: null,
  className: null,
  style: null
};

RestartButton.propTypes = {
  workflow: React.PropTypes.object,
  project: React.PropTypes.object,
  user: React.PropTypes.object,
  children: React.PropTypes.node,
  Dialog: React.PropTypes.func,
  dialog: React.PropTypes.object,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default RestartButton;
