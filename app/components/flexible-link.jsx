import React from 'react';
import { Link } from 'react-router';


export default class FlexibleLink extends React.Component {
  render() {
    let clickHandler = () => {};
    if (this.props.geordiHandler && this.context.geordi && this.context.geordi.makeHandler) {
      clickHandler = this.context.geordi.makeHandler(this.props.geordiHandler);
    }

    if (this.props.to.indexOf('http') > -1) {
      return (<a className={this.props.className} href={this.props.to}>{this.props.children}</a>);
    }

    return (<Link className={this.props.className} to={this.props.to} onClick={clickHandler.bind(this, this.props.logText)}>{this.props.children}</Link>);
  }
}

FlexibleLink.contextTypes = {
  geordi: React.PropTypes.object
};

FlexibleLink.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  geordiHandler: React.PropTypes.string,
  logText: React.PropTypes.string,
  to: React.PropTypes.string.isRequired
};

FlexibleLink.defaultProps = {
  children: null,
  geordiHandler: null,
  logText: null,
  to: ''
};
