import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import talkClient from 'panoptes-client/lib/talk-client';
import Loading from '../components/loading-indicator.cjsx';
import NotificationSection from './notifications/notification-section';
import CollapsableSection from '../components/collapsable-section';

counterpart.registerTranslations('en', {
  notifications: {
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

  componentWillMount() { // eslint-disable-line
    if (this.props.user) return this.getProjectNotifications();
  }

  componentWillReceiveProps(nextProps) { // eslint-disable-line
    if (nextProps.user !== this.props.user) return this.getProjectNotifications();
  }

  onChildChanged(section) {
    this.setState({ expanded: section });
  }

  getProjectNotifications() {
    talkClient.type('notifications').get({ page: 1, page_size: 50 })
    .then((projNotifications) => {
      this.groupNotifications(projNotifications);
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
    this.setState({ projNotifications: projectNotifications });
  }

  renderNotifications() {
    let notificationView;

    if (this.state.projNotifications.length > 0) {
      notificationView = (
        <div>
          <div className="list">
            {this.state.projNotifications.map((notification, i) => {
              return (
                <CollapsableSection key={i} callbackParent={this.onChildChanged} expanded={notification.section === this.state.expanded} section={notification.section}>
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
          <h3 className="centering title notifications-title">
            <Translate content="notifications.title" />
          </h3>

          {signedIn}
        </div>
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  location: React.PropTypes.shape({
    query: React.PropTypes.object
  }),
  user: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    login: React.PropTypes.string
  })
};
