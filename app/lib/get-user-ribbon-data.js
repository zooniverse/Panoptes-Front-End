import getAllProjectPreferences from './get-all-project-preferences';
import getColorFromString from './get-color-from-string';
import apiClient from 'panoptes-client/lib/api-client'

function getUserRibbonData(user) {
  return getAllProjectPreferences(user).then((prefsResources) => {
    const awaitProjects = Promise.all(prefsResources.map((prefsResource) => {
      return apiClient.type('projects').get(prefsResource.links.project).catch(() => {
        return null;
      });
    }));

    return Promise.all([awaitProjects]).then(([projects]) => {
      return prefsResources.map((prefsResource, i) => {
        if (projects[i] !== null) {
          return {
            id: projects[i].id,
            slug: projects[i].slug,
            name: projects[i].display_name,
            owner: projects[i].links.owner.display_name,
            color: getColorFromString(projects[i].slug),
            classifications: prefsResource.activity_count,
            subject_sets: projects[i].links.subject_sets,
          };
        } else {
          return null;
        }
      }).filter(Boolean);
    });
  });
}

export default getUserRibbonData;
