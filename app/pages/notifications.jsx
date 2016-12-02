import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Loading from '../components/loading-indicator';
import talkClient from 'panoptes-client/lib/talk-client';
import NotificationSection from './notifications/notification-section';

counterpart.registerTranslations('en', {
  notifications: {
    title: 'My Notifications',
    signedOut: 'You\'re not signed in.',
    noNotifications: 'You have no notifications.',
    participation: 'You can receive notifications by participating in Talk, following discussions, and receiving messages.',
  },
});

export default class NotificationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChildChanged = this.onChildChanged.bind(this);
    this.state = {
      projNotifications: [],
      expanded: false,
    };
  }

  componentWillMount() {
    if (this.props.user) return this.getProjectNotifications(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) return this.getProjectNotifications(nextProps.user);
  }

  onChildChanged(section) {
    this.setState({ expanded: section });
  }

  getProjectNotifications() {
    if (this.props.project) {
      talkClient.type('notifications').get({ page: 1, page_size: 1, section: `project-${this.props.project.id}` })
      .then((projNotification) => {
        this.setState({ projNotifications: projNotification });
      });
    } else {
      talkClient.type('notifications').get({ page: 1, page_size: 50 })
      .then((projNotifications) => {
        const groupedNotifications = this.groupNotifications(projNotifications);
        this.setState({ projNotifications: groupedNotifications });
      });
    }
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
    return projectNotifications;
  }

  renderNotifications() {
    let notificationView;

    if (this.state.projNotifications.length > 0) {
      notificationView = (
        <div>
          <div className="list">
            {this.state.projNotifications.map((notification) => {
              return (
                <NotificationSection
                  key={notification.id}
                  callbackParent={this.onChildChanged}
                  location={this.props.location}
                  expanded={notification.section === this.state.expanded}
                  projectID={notification.project_id}
                  slug={notification.project_slug}
                  section={notification.section}
                  user={this.props.user}
                />
              );
            })}
          </div>
        </div>
      );
    } else if (this.state.projNotifications.length === 0) {
      notificationView = (
        <div className="centering talk-module">
          <Translate content="notifications.noNotifications" />
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
        <div className="content-container">
          <h3 className={`centering title ${this.props.project ? 'notifications-title__project' : 'notifications-title'}`}>
            <Translate content="notifications.title" />
          </h3>

          {signedIn}
        </div>
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  location: React.PropTypes.object,
  project: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
};
