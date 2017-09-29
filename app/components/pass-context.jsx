import React from 'react';
import {routerShape} from 'react-router/lib/PropTypes';

class PassContext extends React.Component {
  getChildContext() {
    return this.props.context;
  }

  render() {
    return this.props.children;
  }
}

PassContext.contextTypes = {
  initialLoadComplete: React.PropTypes.bool,
  router: routerShape,
  user: React.PropTypes.object,
  geordi: React.PropTypes.object,
  notificationsCounter: React.PropTypes.object,
  unreadNotificationsCount: React.PropTypes.number,
  comms: React.PropTypes.object
};

PassContext.childContextTypes = {
  initialLoadComplete: React.PropTypes.bool,
  router: routerShape,
  user: React.PropTypes.object,
  geordi: React.PropTypes.object,
  notificationsCounter: React.PropTypes.object,
  unreadNotificationsCount: React.PropTypes.number,
  comms: React.PropTypes.object
};

export default PassContext;
