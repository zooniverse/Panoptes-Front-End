import PropTypes from 'prop-types';
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
  geordi: PropTypes.object
};

FlexibleLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  geordiHandler: PropTypes.string,
  logText: PropTypes.string,
  to: PropTypes.string.isRequired
};

FlexibleLink.defaultProps = {
  children: null,
  geordiHandler: null,
  logText: null,
  to: ''
};