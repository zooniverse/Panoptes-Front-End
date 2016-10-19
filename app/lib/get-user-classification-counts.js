import getAllProjectPreferences from './get-all-project-preferences';
import apiClient from 'panoptes-client/lib/api-client';

function getUserClassificationCounts(user) {
  return getAllProjectPreferences(user).then((projectPreferences) => {
    const activePreferences = projectPreferences.filter((preference) => {
      if (preference.activity_count > 0)
        return preference;
    });
    const projectIDs = activePreferences.map((projectPreference) => {
      return projectPreference.links.project;
    });
    return apiClient.type('projects').get({ id: projectIDs, cards: true, page_size: activePreferences.length }).catch(() => {
      return null;
    })
    .then((projects) => {
      const classifications = activePreferences.reduce((counts, projectPreference) => {
        counts[projectPreference.links.project] = projectPreference.activity_count;
        return counts;
      }, {});
      const pairs = projects.map((project) => {
        project.activity_count = classifications[project.id]
        return project;
      });
      return pairs;
    });
  });
}

export default getUserClassificationCounts;
