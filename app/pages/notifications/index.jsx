import counterpart from 'counterpart';
import { shape, string } from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Translate from 'react-translate-component';
import talkClient from 'panoptes-client/lib/talk-client';

import NotificationSection from './notification-section';
import CollapsableSection from '../../components/collapsable-section';
import Loading from '../../components/loading-indicator';

counterpart.registerTranslations('en', {
  notifications: {
    header: 'Notifications',
    title: 'My Notifications',
    signedOut: 'You\'re not signed in.',
    noNotifications: 'You have no notifications.',
    participation: 'You can receive notifications by participating in Talk, following discussions, and receiving messages.'
  }
});

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      expanded: false,
      loading: false,
      notifications: []
    };

    this.handleExpand = this.handleExpand.bind(this);
  }

  componentDidMount() {
    const { project, user } = this.props;

    if (user) {
      this.fetchNotifications();
    }

    if (project) {
      this.setState({ expanded: project.id });
    }
  }

  componentDidUpdate(prevProps) {
    const { project, user } = this.props;

    if (user && !prevProps.user) {
      this.fetchNotifications();
    }

    if (project !== prevProps.project) {
      this.setState({ expanded: project.id });
    }
  }

  handleExpand(sectionID) {
    this.setState({ expanded: sectionID });
  }

  async fetchNotifications() {
    this.setState({ loading: true });

    function requestAllNotifications() {
      let notifications = [];

      function getNotifications(page) {
        return talkClient
          .type('notifications')
          .get({ page, page_size: 50 })
          .then((response) => {
            notifications = notifications.concat(response);
            const meta = response[0] ? response[0].getMeta() : null;
            if (meta && meta.next_page) {
              return getNotifications(meta.next_page);
            }
            return Promise.resolve(notifications);
          })
          .catch((error) => {
            throw error;
          });
      }
      return getNotifications(1);
    }

    try {
      const notifications = await requestAllNotifications();
      this.setState({ notifications, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  groupNotifications(allNotifications) {
    const notificationsMap = {};
    allNotifications.forEach((notification) => {
      const { project_id: projectID, section } = notification;
      const notificationSectionID = projectID || section;
      if (!notificationsMap[notificationSectionID]) {
        notificationsMap[notificationSectionID] = [notification];
      }
      notificationsMap[notificationSectionID].push(notification);
    });
    return notificationsMap;
  }

  render() {
    const {
      location, project, user
    } = this.props;
    const {
      error, expanded, loading, notifications
    } = this.state;

    let groupedNotifications = {};
    let groupedNotificationsIDs = [];
    if (notifications?.length > 0) {
      groupedNotifications = this.groupNotifications(notifications);
      groupedNotificationsIDs = Object.keys(groupedNotifications);
      if (groupedNotificationsIDs.includes('zooniverse')) {
        groupedNotificationsIDs.splice(groupedNotificationsIDs.indexOf('zooniverse'), 1);
        groupedNotificationsIDs.unshift('zooniverse');
      }
    }

    const headerStyle = project ? 'notifications-title talk-module' : 'notifications-title';

    let content = '';
    if (!user) {
      content = (
        <Translate content="notifications.signedOut" />
      );
    } else if (error) {
      content = (
        <span>{error.message}</span>
      );
    } else if (loading) {
      content = (
        <Loading />
      );
    } else if (notifications?.length === 0) {
      content = (
        <div className="centering talk-module notifications-title">
          <Translate content="notifications.noNotifications" />
          {' '}
          <Translate content="notifications.participation" />
        </div>
      );
    }

    return (
      <div className="talk notifications">
        <Helmet title={counterpart('notifications.header')} />
        <div className="content-container">
          <h3 className={headerStyle}>
            <Translate content="notifications.title" />
          </h3>
          {content ? (
            <div className="centering talk-module">
              {content}
            </div>
          ) : (
            <div>
              <div className="list">
                {groupedNotificationsIDs.map((notificationSectionID) => {
                  const opened = notificationSectionID === expanded || groupedNotificationsIDs.length === 1;

                  const slug = groupedNotifications[notificationSectionID][0].project_slug;

                  const sectionNotifications = groupedNotifications[notificationSectionID] || [];
                  const uniqueNotifications = sectionNotifications.filter((notification, index, self) => (
                    index === self.findIndex((t) => t.id === notification.id)
                  ));

                  return (
                    <CollapsableSection
                      key={`collapsable-section-${notificationSectionID}`}
                      callbackParent={() => {
                        const section = expanded === notificationSectionID ? false : notificationSectionID;
                        this.handleExpand(section);
                      }}
                      expanded={opened}
                      section={notificationSectionID}
                    >
                      <NotificationSection
                        key={`notification-section-${notificationSectionID}`}
                        location={location}
                        notifications={uniqueNotifications}
                        slug={slug}
                        user={user}
                      />
                    </CollapsableSection>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

NotificationsPage.defaultProps = {
  location: {
    query: {
      page: '1'
    }
  },
  project: null,
  user: null
};

NotificationsPage.propTypes = {
  location: shape({
    query: shape({
      page: string
    })
  }),
  project: shape({
    id: string
  }),
  user: shape({
    display_name: string,
    login: string
  })
};
