import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

class NotificationsCounter {
  static getProject(slug) {
    return apiClient.type('projects').get({ slug });
  }

  static getNotifications(section) {
    const query = {
      delivered: false,
      page_size: 1
    };
    if (section) {
      query.section = section;
    }
    return talkClient.type('notifications').get(query);
  }

  constructor() {
    this.callbacks = [];
  }

  update(user, owner, name) {
    let unreadCount = 0;
    if (!user) {
      return Promise.resolve(unreadCount);
    }

    if (this.loading) {
      return Promise.resolve(unreadCount);
    }

    this.loading = true;

    this.owner = owner;
    this.name = name;
    this.setSection().then((section) => {
      this.countUnread(section).then((count) => {
        unreadCount = count;
        this.loading = false;
        this.callbacks.map((callback) => {
          callback(unreadCount);
        });
      });
    });
    return Promise.resolve(unreadCount);
  }

  setSection() {
    if (this.owner && this.name) {
      const slug = `${this.owner}/${this.name}`;

      if (this.slug !== slug) {
        this.slug = slug;
        return NotificationsCounter.getProject(slug).then((projects) => {
          this.section = `project-${projects[0].id}`;
          return Promise.resolve(this.section);
        });
      } else {
        return Promise.resolve(this.section);
      }
    } else {
      this.owner = null;
      this.name = null;
      this.slug = null;
      this.section = null;
      return Promise.resolve(null);
    }
  }

  countUnread(section) {
    return NotificationsCounter.getNotifications(section).then((notifications) => {
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
