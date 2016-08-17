import React from 'react';
// import classnames from 'classnames';

export default class CustomSignInPrompt extends React.Component {
  constructor() {
    super();
    this.hide = this.hide.bind(this);
    this.state = {
      hidden: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show && this.state.hidden === true) {
      this.setState({ hidden: false });
    }
  }

  hide() {
    this.setState({ hidden: true });
  }

  render() {
    let prompt;
    if (!this.state.hidden) {
      prompt = (
        <div>
          {this.props.children}
          <button type="button" className="secret-button" onClick={this.hide}>
            x
          </button>
        </div>);
    } else {
      prompt = <div></div>;
    }

    return (prompt);
  }
}

CustomSignInPrompt.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
    React.PropTypes.node.isRequired,
  ]),
  show: React.PropTypes.bool.isRequired,
};

CustomSignInPrompt.defaultProps = {
  children: null,
  show: false,
};
