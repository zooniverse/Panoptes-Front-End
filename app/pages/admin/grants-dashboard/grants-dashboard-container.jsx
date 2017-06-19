import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

import ProjectSearch from './project-search';

class GrantsDashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.info('yea')
    return (
      <section>
        <ProjectSearch />
      </section>
    );
  }

}

export default GrantsDashboard;
