import getUserClassificationCounts from './get-user-classification-counts';
import getColorFromString from './get-color-from-string';

function getUserRibbonData(user) {
  return getUserClassificationCounts(user).then((projects) => {
    return projects.map((project, i) => {
      if (projects[i] !== null) {
        return {
          avatar_src: projects[i].avatar_src,
          id: projects[i].id,
          slug: projects[i].slug,
          name: projects[i].display_name,
          color: getColorFromString(projects[i].slug),
          classifications: projects[i].activity_count,
          updated_at: projects[i].updated_at,
        };
      } else {
        return null;
      }
    }).filter(Boolean);
  });
}

export default getUserRibbonData;
