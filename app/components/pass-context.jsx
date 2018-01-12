import React from 'react';
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
  initialLoadComplete: React.PropTypes.bool,
  router: routerShape,
  user: React.PropTypes.object,
  geordi: React.PropTypes.object,
  notificationsCounter: React.PropTypes.object,
  unreadNotificationsCount: React.PropTypes.number,
  pusher: React.PropTypes.object
};

PassContext.contextTypes = contextShape;

PassContext.childContextTypes = contextShape;

PassContext.propTypes = {
  children: React.PropTypes.node.isRequired,
  context: React.PropTypes.shape(contextShape).isRequired
};

export default PassContext;

