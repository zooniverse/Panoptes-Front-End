function getAllProjectPreferences(user, _page = 1, _accumulator = []) {
  return user.get('project_preferences', {
    page: _page,
  })
  .then((projectPreferences) => {
    if (projectPreferences.length === 0) {
      return projectPreferences;
    } else {
      _accumulator.push(...projectPreferences);
      const meta = projectPreferences[0].getMeta();
      if (meta.page === meta.page_count) {
        return _accumulator;
      } else {
        return getAllProjectPreferences(user, meta.page + 1, _accumulator);
      }
    }
  });
}

export default getAllProjectPreferences;
