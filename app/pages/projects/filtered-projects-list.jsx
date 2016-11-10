import counterpart from 'counterpart';
import React, { Component, PropTypes } from 'react';

import ProjectFilteringInterface from './project-filtering-interface';

counterpart.registerTranslations('en', {
  projects: {
    button: 'Get Started',
    countMessage: 'Showing %(pageStart)s-%(pageEnd)s of %(count)s projects found.',
    notFoundMessage: 'Sorry, no projects found.',
  },
});

class FilteredProjectsList extends Component {
  render() {
    const { discipline, page, sort, status } = this.props.location.query;
    const filteringProps = { discipline, page, sort, status };
    return (
      <ProjectFilteringInterface
        onChangeQuery={this.context.updateQuery}
        {...filteringProps}
      />
    );
  }
}

FilteredProjectsList.contextTypes = {
  updateQuery: PropTypes.func,
};

FilteredProjectsList.propTypes = {
  location: PropTypes.object.isRequired,
};

export default FilteredProjectsList;
