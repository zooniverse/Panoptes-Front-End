import getAllProjectPreferences from './get-all-project-preferences';
import getColorFromString from './get-color-from-string';

function getUserRibbonData(user) {
  return getAllProjectPreferences(user).then((prefsResources) => {
    const awaitProjects = Promise.all(prefsResources.map((prefsResource) => {
      return prefsResource.get('project').catch(() => {
        return null;
      });
    }));

    const awaitOwners = awaitProjects.then((projects) => {
      return Promise.all(projects.map((project) => {
        if (project === null) {
          return null;
        } else {
          return project.get('owner').catch(() => {
            return null;
          });
        }
      }));
    });

    return Promise.all([awaitProjects, awaitOwners]).then(([projects, owners]) => {
      return prefsResources.map((prefsResource, i) => {
        if (projects[i] !== null && owners[i] !== null) {
          return {
            id: projects[i].id,
            name: projects[i].display_name,
            owner: owners[i].display_name,
            color: getColorFromString(projects[i].slug),
            classifications: prefsResource.activity_count,
          };
        } else {
          return null;
        }
      }).filter(Boolean);
    });
  });
}

export default getUserRibbonData;
