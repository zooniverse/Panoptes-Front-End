import getAllProjectPreferences from '../../lib/get-all-project-preferences';
import talkClient from 'panoptes-client/lib/talk-client';

function getNotificationProjects(user) {
  return getAllProjectPreferences(user).then((projectPreferences) => {
    function newestNotification(project) {
      return talkClient.type('notifications').get({ page: 1, page_size: 1, section: project })
      .catch(() => {
        return null;
      })
      .then(([notification]) => {
        return notification;
      });
    };

    return newestNotification('zooniverse').then((zooniverse) => {
      const projNotifications = projectPreferences.map((projectPreference) => {
        const section = 'project-' + projectPreference.links.project;
        return newestNotification(section);
      });

      const filteredProjects = Promise.all(projNotifications).then((projects) => {
        const sorted = projects.sort((a, b) => {
          return a.updated_at < b.updated_at;
        });
        sorted.unshift(zooniverse);
        return sorted.filter(Boolean);
      });

      return filteredProjects;
    });
  });
}

export default getNotificationProjects;
