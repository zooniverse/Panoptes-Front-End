import React from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router/lib/PropTypes';

class PassContext extends React.Component {
  getChildContext() {
    return this.props.context;
  }

  render() {
    return this.props.children;
  }
}

const contextShape = {
  initialLoadComplete: PropTypes.bool,
  router: routerShape,
  user: PropTypes.object,
  geordi: PropTypes.object,
  notificationsCounter: PropTypes.object,
  unreadNotificationsCount: PropTypes.number,
  store: PropTypes.object
};

PassContext.contextTypes = contextShape;

PassContext.childContextTypes = contextShape;

PassContext.propTypes = {
  children: PropTypes.node.isRequired,
  context: PropTypes.shape(contextShape).isRequired
};

export default PassContext;
