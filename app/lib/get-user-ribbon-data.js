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

    const awaitSubjectSets = awaitProjects.then((projects) => {
      return Promise.all(projects.map((project) => {
        return project.get('subject_sets').catch(() => {
          return null;
        });
      }));
    });

    return Promise.all([awaitProjects, awaitSubjectSets]).then(([projects, subject_sets]) => {
      return prefsResources.map((prefsResource, i) => {
        const sortedSubjects = subject_sets[i].sort((a, b) => {
          return new Date(b.updated_at) - new Date(a.updated_at)
        });
        if (projects[i] !== null) {
          return {
            id: projects[i].id,
            slug: projects[i].slug,
            name: projects[i].display_name,
            owner: projects[i].links.owner.display_name,
            color: getColorFromString(projects[i].slug),
            classifications: prefsResource.activity_count,
            recentSubjectSet: sortedSubjects[0],
          };
        } else {
          return null;
        }
      }).filter(Boolean);
    });
  });
}

export default getUserRibbonData;
