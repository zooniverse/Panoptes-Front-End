import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';

class NotificationsCounter {
  constructor() {
    this.callbacks = [];
  }

  update(user, owner, name) {
    if (!user) {
      return Promise.resolve(0);
    }

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.owner = owner;
    this.name = name;
    this.setSection().then((section) => {
      this.countUnread().then(() => {
        this.loading = false;
      });
    });
  }

  setSection() {
    if (this.owner && this.name) {
      const slug = `${this.owner}/${this.name}`;

      if (this.slug !== slug) {
        this.slug = slug;
        return this.getProject(slug).then((projects) => {
          return this.section = `project-${projects[0].id}`;
        });
      } else {
        return Promise.resolve(this.section);
      }
    } else {
      this.owner = this.name = this.slug = this.section = null;
      return Promise.resolve(null);
    }
  }

  getProject(slug) {
    return apiClient.type('projects').get({ slug });
  }

  getNotifications() {
    return talkClient.type('notifications').get({
      delivered: false,
      page_size: 1,
      section
    });
  }

  countUnread() {
    return this.getNotifications().then((notifications) => {
      try {
        this.setUnread(notifications[0].getMeta().count);
      } catch (e) {
        this.setUnread(0);
      }
    });
  }

  setUnread(count) {
    if (this.unreadCount !== count) {
      this.unreadCount = count;
      this.callbacks.map((callback) => {
        callback(count);
      });
    }
  }

  listen(fn) {
    this.callbacks.push(fn);
  }
}

export default NotificationsCounter;
