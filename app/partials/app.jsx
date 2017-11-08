import React from 'react';
import auth from 'panoptes-client/lib/auth';
import { Helmet } from 'react-helmet';
import counterpart from 'counterpart';
import AppStatus from './app-status';
import IOStatus from './io-status';
import AppLayout from '../layout';
import GeordiLogger from '../lib/geordi-logger';
import {generateSessionID} from '../lib/session';
import NotificationsCounter from '../lib/notifications-counter';
import apiClient from 'panoptes-client/lib/api-client';
import {CommsClient} from '../lib/comms-client';

counterpart.registerTranslations('en', {
  mainApp: {
    title: 'Zooniverse'
  }
});

class PanoptesApp extends React.Component {
  constructor(props) {
    super(props);
    this.geordiLogger = null; // Maintains project and subject context for the Geordi client

    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.updateNotificationsCount = this.updateNotificationsCount.bind(this);

    this.state = {
      initialLoadComplete: false,
      user: null
    }
  }

  getChildContext() {
    return {
      initialLoadComplete: this.state.initialLoadComplete,
      user: this.state.user,
      geordi: this.geordiLogger,
      notificationsCounter: this.props.notificationsCounter,
      unreadNotificationsCount: this.state.unreadNotificationsCount,
      comms: this.props.comms
    }
  }

  componentWillMount() {
    this.geordiLogger = new GeordiLogger();
  }

  componentDidMount() {
    this.props.notificationsCounter.listen(unreadNotificationsCount => {
      this.setState({unreadNotificationsCount});
    });

    window.comms = this.props.comms;
    this.props.comms.connect();

    auth.listen('change', this.handleAuthChange);
    this.handleAuthChange();
    generateSessionID();
  }

  componentWillUnmount() {
    this.props.comms.disconnect()
    auth.stopListening('change', this.handleAuthChange);
  }

  componentWillReceiveProps(nextProps) {
    this.updateNotificationsCount({params: nextProps.params});
  }

  handleAuthChange() {
    this.geordiLogger.forget(['userID']);

    auth.checkCurrent().then(user => {
      this.setState({
        initialLoadComplete: true,
        user
      });
      this.props.comms.authenticate(auth);
      this.updateNotificationsCount({user});

      if (user != null) {
        this.geordiLogger.remember({userID: user.id});
      }
    });
  }

  updateNotificationsCount({user, params}) {
    if (!user) { ({ user } = this.state); }
    if (!params) { ({ params } = this.props); }
    const {owner, name} = params;
    this.props.notificationsCounter.update(user, owner, name);
  }

  render() {
    return (
      <div className="panoptes-main">
        <Helmet defaultTitle={counterpart('mainApp.title')} titleTemplate="%s \u2014 #{counterpart('mainApp.title')}" />
        <AppStatus />
        <IOStatus />
        <AppLayout {...this.props}>
          {React.cloneElement(this.props.children, {user: this.state.user})}
        </AppLayout>
      </div>
    );
  }
}

PanoptesApp.childContextTypes = {
  initialLoadComplete: React.PropTypes.bool,
  user: React.PropTypes.object,
  geordi: React.PropTypes.object,
  notificationsCounter: React.PropTypes.object,
  unreadNotificationsCount: React.PropTypes.number,
  comms: React.PropTypes.object
}

PanoptesApp.defaultProps = {
  notificationsCounter: new NotificationsCounter(),
  comms: new CommsClient()
}

module.exports = PanoptesApp
