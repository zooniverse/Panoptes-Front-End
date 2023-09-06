import counterpart from 'counterpart';
import talkClient from 'panoptes-client/lib/talk-client';
import { shape, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Translate from 'react-translate-component';

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

export default function NotificationsPage({ location, project, user }) {
  const [groupedNotifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (project) {
      setExpanded(`project-${project.id}`);
    }
  }, [project]);

  function groupNotifications(notifications) {
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
    if (project && projectSections.indexOf(`project-${project.id}`) < 0) {
      talkClient.type('notifications').get({ page: 1, page_size: 1, section: `project-${project.id}` })
        .then(([notification]) => {
          if (notification) {
            projectNotifications.push(notification);
            setNotifications(projectNotifications);
            setExpanded(`project-${project.id}`);
          }
        });
    }

    setNotifications(projectNotifications);
  }

  function getNotifications() {
    talkClient.type('notifications').get({ page: 1, page_size: 50 })
      .then((notifications) => {
        groupNotifications(notifications);
      })
      .then(() => {
        if (project) setExpanded(`project-${project.id}`);
      })
      .catch((e) => {
        console.error('Unable to load notifications', e);
      });
  }

  function renderNotifications() {
    let notificationView;

    if (groupedNotifications.length > 0) {
      notificationView = (
        <div>
          <div className="list">
            {groupedNotifications.map((notification) => {
              const opened = notification.section === expanded || groupedNotifications.length === 1;
              return (
                <CollapsableSection
                  key={notification.section}
                  callbackParent={() => {
                    setExpanded(expanded === notification.section ? false : notification.section);
                  }}
                  expanded={opened}
                  section={notification.section}
                >
                  <NotificationSection
                    key={notification.id}
                    location={location}
                    projectID={notification.project_id}
                    slug={notification.project_slug}
                    user={user}
                  />
                </CollapsableSection>
              );
            })}
          </div>
        </div>
      );
    } else if (groupedNotifications.length === 0) {
      notificationView = (
        <div className="centering talk-module notifications-title">
          <Translate content="notifications.noNotifications" />
          {' '}
          <Translate content="notifications.participation" />
        </div>
      );
    } else {
      notificationView = <Loading />;
    }

    return notificationView;
  }

  let signedIn;
  const headerStyle = project ? 'notifications-title talk-module' : 'notifications-title';

  if (user) {
    signedIn = renderNotifications();
  } else {
    signedIn = (
      <div className="centering talk-module">
        <Translate content="notifications.signedOut" />
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
        {signedIn}
      </div>
    </div>
  );
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
