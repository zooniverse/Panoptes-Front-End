import React from 'react';

const PROMPT_CUSTOM_SIGN_IN_EVERY = 5;

export default class CustomSignInPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.state = {
      hidden: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.classificationsThisSession % PROMPT_CUSTOM_SIGN_IN_EVERY === 0) {
      this.setState({ hidden: false });
    }
  }

  hide() {
    this.setState({ hidden: true });
  }

  render() {
    if (!this.state.hidden) {
      return (
        <div className="project-announcement-banner custom-sign-in-banner">
          <span>
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>{' '}
            {this.props.children}
          </span>
          <button type="button" className="secret-button" onClick={this.hide}>
            x
          </button>
        </div>);
    }

    return (null);
  }
}

CustomSignInPrompt.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
    React.PropTypes.node.isRequired,
  ]),
  classificationsThisSession: React.PropTypes.number.isRequired,
};

CustomSignInPrompt.defaultProps = {
  children: null,
  classificationsThisSession: 0,
};
