import getAllProjectPreferences from './get-all-project-preferences';

function getUserClassificationCounts(user) {
  return getAllProjectPreferences(user).then((projectPreferences) => {
    return Promise.all(projectPreferences.map((projectPreference) => {
      return projectPreference.get('project').catch(() => {
        return null;
      });
    })).then((projects) => {
      return projectPreferences.reduce((counts, projectPreference, i) => {
        if (!!projects[i]) {
          counts[projects[i].id] = projectPreference.activity_count;
        }
        return counts;
      }, {});
    });
  });
}

export default getUserClassificationCounts;
