import counterpart from 'counterpart';
import {
  arrayOf,
  bool,
  func,
  oneOfType,
  shape,
  string
} from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Translate from 'react-translate-component';

import useNotifications from './useNotifications';
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

export function NotificationsSections({
  expanded,
  groupedNotifications,
  handleExpand,
  location,
  user
}) {
  const notificationSectionIDs = Object.keys(groupedNotifications);
  if (notificationSectionIDs.includes('zooniverse')) {
    notificationSectionIDs.splice(notificationSectionIDs.indexOf('zooniverse'), 1);
    notificationSectionIDs.unshift('zooniverse');
  }

  return (
    <div>
      <div className="list">
        {notificationSectionIDs.map((notificationSectionID) => {
          const opened = notificationSectionID === expanded || notificationSectionIDs.length === 1;
          const slug = groupedNotifications[notificationSectionID][0].project_slug;
          const notifications = groupedNotifications[notificationSectionID] || [];
          const uniqueNotifications = notifications.filter((notification, index, self) => (
            index === self.findIndex((t) => t.id === notification.id)
          ));

          return (
            <CollapsableSection
              key={`collapsable-section-${notificationSectionID}`}
              callbackParent={() => {
                const section = expanded === notificationSectionID ? false : notificationSectionID;
                handleExpand(section);
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
  );
}

const DEFAULT_HANDLER = () => true;

NotificationsSections.defaultProps = {
  expanded: false,
  groupedNotifications: {},
  handleExpand: DEFAULT_HANDLER
};

NotificationsSections.propTypes = {
  expanded: oneOfType([bool, string]),
  groupedNotifications: shape({
    id: arrayOf(shape({
      id: string,
      project_id: string
    }))
  }),
  handleExpand: func
};

export default function NotificationsPage({ location, project, user }) {
  const [expanded, setExpanded] = useState(false);
  const {
    loading,
    notifications,
    error
  } = useNotifications(user);

  useEffect(() => {
    if (project) {
      setExpanded(project.id);
    }
  }, [project]);

  function handleExpand(sectionID) {
    setExpanded(sectionID);
  }

  function groupNotifications(allNotifications) {
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

  let groupedNotifications = {};
  if (notifications?.length > 0) {
    groupedNotifications = groupNotifications(notifications);
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
          <NotificationsSections
            expanded={expanded}
            groupedNotifications={groupedNotifications}
            handleExpand={handleExpand}
            location={location}
            user={user}
          />
        )}
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
