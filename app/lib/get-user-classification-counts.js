import getAllProjectPreferences from './get-all-project-preferences';
import apiClient from 'panoptes-client/lib/api-client';

function getUserClassificationCounts(user) {
  return getAllProjectPreferences(user).then((projectPreferences) => {
    const projectIDs = projectPreferences.map((projectPreference) => {
      return projectPreference.links.project;
    });
    return apiClient.type('projects').get({ id: projectIDs, cards: true, page_size: projectPreferences.length }).catch(() => {
      return null;
    })
    .then((projects) => {
      const classifications = projectPreferences.reduce((counts, projectPreference) => {
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
