import PropTypes from 'prop-types';
import React from 'react';

import OrganizationStats from './OrganizationStats';

class OrganizationStatsContainer extends React.Component {
  render() {
    return (
      <OrganizationStats {...this.props} />
    );
  }
}

export default OrganizationStatsContainer;
