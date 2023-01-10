import apiClient from 'panoptes-client/lib/api-client';

function getProjectsForPreferences(preferences) {
  const projectIDs = preferences.map(projectPreference => projectPreference.links.project);
  return apiClient
    .type('projects')
    .get({ id: projectIDs, cards: true, page_size: preferences.length })
    .catch((error) => {
      console.log('Something went wrong. Error: ', error);
    })
    .then((projects) => {
      const classifications = preferences.reduce((counts, projectPreference) => {
        counts[projectPreference.links.project] = projectPreference.activity_count;
        return counts;
      }, {});
      const sortOrders = preferences.reduce((orders, projectPreference) => {
        orders[projectPreference.links.project] = projectPreference.sort_order;
        return orders;
      }, {});
      return projects.map((project) => {
        project.activity_count = classifications[project.id];
        project.sort_order = sortOrders[project.id];
        return project;
      });
    });
}

function sortProjects(projects) {
  return projects
    .sort((a, b) => a.sort_order - b.sort_order)
    .filter(Boolean)
    .map((project, i) => ({
      avatar_src: projects[i].avatar_src,
      id: projects[i].id,
      slug: projects[i].slug,
      display_name: projects[i].display_name,
      description: projects[i].description,
      classifications: projects[i].activity_count,
      updated_at: projects[i].updated_at,
      redirect: projects[i].redirect
    }));
}

export function getUserProjects(user, callback, _page = 1) {
  return user.get('project_preferences', {
    sort: '-updated_at',
    page: _page
  })
    .then((projectPreferences) => {
      if (projectPreferences.length === 0) {
        return [];
      } else {
      // continue paging through preferences until we've got them all.
        const meta = projectPreferences[0].getMeta();
        if (meta.page !== meta.page_count) {
          getUserProjects(user, callback, meta.page + 1);
        }
        // filter out projects you haven't classified on AND that are not marked as hidden.
        let activePreferences = projectPreferences.filter((preference) => {
          const userHasClassified = preference.activity_count > 0;
          const isVisiblePreference = !preference.settings.hidden;
          return userHasClassified && isVisiblePreference;
        });
        // get the projects that you have classified on, if any.
        if (activePreferences.length > 0) {
          activePreferences = activePreferences.map((preference, i) => {
            preference.sort_order = i;
            return preference;
          });
          const projects = getProjectsForPreferences(activePreferences)
            .then(sortProjects)
            .then(callback);
        }
      }
    });
}

export function getUserClassifications(user, _page = 1) {
  return user.get('classifications', {
    sort: '-created_at',
    page: _page
  });
}
