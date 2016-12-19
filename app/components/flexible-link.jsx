import React from 'react';
import { Link } from 'react-router';


export default class FlexibleLink extends React.Component {
  render() {
    let clickHandler = () => {};
    if (this.props.geordiHandler && this.context.geordi && this.context.geordi.makeHandler) {
      clickHandler = this.context.geordi.makeHandler(this.props.geordiHandler);
    }

    if (this.props.to.indexOf('http') > -1) {
      return (<a href={this.props.to}>{this.props.children}</a>);
    }

    return (<Link to={this.props.to} onClick={clickHandler.bind(this, this.props.logText)}>{this.props.children}</Link>);
  }
}

FlexibleLink.contextTypes = {
  geordi: React.PropTypes.object,
};

FlexibleLink.propTypes = {
  children: React.PropTypes.node,
  geordiHandler: React.PropTypes.string,
  logText: React.PropTypes.string,
  to: React.PropTypes.string.isRequired,
};

FlexibleLink.defaultProps = {
  children: null,
  geordiHandler: null,
  logText: null,
  to: '',
};
