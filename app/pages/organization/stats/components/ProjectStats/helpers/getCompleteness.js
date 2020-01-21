function getCompleteness(resource) {
  let { completeness } = resource;

  if (completeness !== 1
    && resource.configuration
    && resource.configuration.stats_completeness_type
    && resource.configuration.stats_completeness_type === 'classification'
    && resource.subjects_count
    && resource.retirement
    && resource.retirement.options
    && resource.retirement.options.count
    && resource.classifications_count) {
    const totalCount = resource.subjects_count * resource.retirement.options.count;
    completeness = resource.classifications_count / totalCount;
  }

  return completeness > 1 ? 1 : completeness;
}

export default getCompleteness;
