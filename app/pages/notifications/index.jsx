import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import talkClient from 'panoptes-client/lib/talk-client';
import { Helmet } from 'react-helmet';
import Loading from '../../components/loading-indicator';
import NotificationSection from '../notifications/notification-section';
import CollapsableSection from '../../components/collapsable-section';

counterpart.registerTranslations('en', {
  notifications: {
    header: 'Notifications',
    title: 'My Notifications',
    signedOut: 'You\'re not signed in.',
    noNotifications: 'You have no notifications.',
    participation: 'You can receive notifications by participating in Talk, following discussions, and receiving messages.'
  }
});

export default class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChildChanged = this.onChildChanged.bind(this);
    this.state = {
      projNotifications: [],
      expanded: false
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.getProjectNotifications();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== null && nextProps.user !== this.props.user) {
      this.getProjectNotifications();
    }
  }

  onChildChanged(section) {
    this.setState({ expanded: section });
  }

  getProjectNotifications() {
    talkClient.type('notifications').get({ page: 1, page_size: 50 })
    .then((projNotifications) => {
      this.groupNotifications(projNotifications);
    })
    .then(() => {
      if (this.props.project) this.setState({ expanded: `project-${this.props.project.id}` });
    })
    .catch((e) => {
      console.error('Unable to load notifications', e);
    });
  }

  groupNotifications(notifications) {
    const projectSections = [];
    const projectNotifications = [];
    notifications.forEach((notification) => {
      if (projectSections.indexOf(notification.section) < 0) {
        if (notification.section === 'zooniverse') {
          projectSections.unshift(notification.section);
          projectNotifications.unshift(notification);
        } else {
          projectSections.push(notification.section);
          projectNotifications.push(notification);
        }
      }
    });
    if (this.props.project && projectSections.indexOf(`project-${this.props.project.id}`) < 0) {
      talkClient.type('notifications').get({ page: 1, page_size: 1, section: `project-${this.props.project.id}` })
      .then(([notification]) => {
        if (notification) {
          projectNotifications.push(notification);
          this.setState({ projNotifications: projectNotifications });
          this.setState({ expanded: `project-${this.props.project.id}` });
        }
      });
    }
    this.setState({ projNotifications: projectNotifications });
  }

  renderNotifications() {
    let notificationView;

    if (this.state.projNotifications.length > 0) {
      notificationView = (
        <div>
          <div className="list">
            {this.state.projNotifications.map((notification, i) => {
              const opened = notification.section === this.state.expanded || this.state.projNotifications.length === 1;
              return (
                <CollapsableSection key={i} callbackParent={this.onChildChanged} expanded={opened} section={notification.section}>
                  <NotificationSection
                    key={notification.id}
                    location={this.props.location}
                    projectID={notification.project_id}
                    slug={notification.project_slug}
                    user={this.props.user}
                  />
                </CollapsableSection>
              );
            })}
          </div>
        </div>
      );
    } else if (this.state.projNotifications.length === 0) {
      notificationView = (
        <div className="centering talk-module notifications-title">
          <Translate content="notifications.noNotifications" />{' '}
          <Translate content="notifications.participation" />
        </div>
      );
    } else {
      notificationView = <Loading />;
    }

    return notificationView;
  }

  render() {
    let signedIn;
    const headerStyle = this.props.project ? 'notifications-title talk-module' : 'notifications-title';

    if (this.props.user) {
      signedIn = this.renderNotifications();
    } else {
      signedIn = (
        <div className="centering talk-module">
          <Translate content="notifications.signedOut" />
        </div>
      );
    }

    return (
      <div className="talk notifications">
        <Helmet title={counterpart("notifications.header")} />
        <div className="content-container">
          <h3 className={headerStyle}>
            <Translate content="notifications.title" />
          </h3>

          {signedIn}
        </div>
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.object
  }),
  project: PropTypes.shape({
    id: PropTypes.string
  }),
  user: PropTypes.shape({
    display_name: PropTypes.string,
    login: PropTypes.string
  })
};