import talkClient from 'panoptes-client/lib/talk-client';

class NotificationsCounter {
  static getNotifications() {
    const query = {
      delivered: false,
      page_size: 1
    };
    return talkClient.type('notifications').get(query);
  }

  constructor() {
    this.callbacks = [];
  }

  update(user) {
    let unreadCount = 0;
    if (!user) {
      return Promise.resolve(unreadCount);
    }

    if (this.loading) {
      return Promise.resolve(unreadCount);
    }

    this.loading = true;

    this.countUnread().then((count) => {
      unreadCount = count;
      this.loading = false;
      this.callbacks.map((callback) => {
        callback(unreadCount);
      });
    });
    return Promise.resolve(unreadCount);
  }

  countUnread() {
    return NotificationsCounter.getNotifications().then((notifications) => {
      try {
        return this.setUnread(notifications[0].getMeta().count);
      } catch (e) {
        return this.setUnread(0);
      }
    });
  }

  setUnread(count) {
    if (this.unreadCount !== count) {
      this.unreadCount = count;
      return Promise.resolve(count);
    }
    return Promise.resolve(this.unreadCount);
  }

  listen(fn) {
    this.callbacks.push(fn);
  }
}

export default NotificationsCounter;
