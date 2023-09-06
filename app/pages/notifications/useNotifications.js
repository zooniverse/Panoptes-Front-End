/* eslint-disable prefer-arrow-callback */

import { useEffect, useState } from 'react';
import talkClient from 'panoptes-client/lib/talk-client';

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

export default function useNotifications(user) {
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(function onUserChange() {
    async function fetchNotifications() {
      try {
        const allNotifications = await requestAllNotifications();
        setNotifications(allNotifications);
      } catch (requestError) {
        setError(requestError);
      }
    }

    if (user) {
      fetchNotifications();
    }

    return () => {
      setNotifications(null);
      setError(null);
    };
  }, [user]);

  const loading = !error && !notifications;
  return { loading, notifications, error };
}
