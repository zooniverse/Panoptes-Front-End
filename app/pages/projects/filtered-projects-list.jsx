import counterpart from 'counterpart';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ProjectFilteringInterface from './project-filtering-interface';

counterpart.registerTranslations('en', {
  projects: {
    button: 'Get Started',
    countMessage: 'Showing %(pageStart)s-%(pageEnd)s of %(projectCount)s projects found.',
    notFoundMessage: 'Sorry, no projects found.',
  },
});

class FilteredProjectsList extends Component {
  render() {
    const { discipline, page, sort, status, page_size } = this.props.location.query;
    const filteringProps = { discipline, page, sort, status, page_size };
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