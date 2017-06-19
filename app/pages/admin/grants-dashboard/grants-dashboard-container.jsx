import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

import ProjectSearch from './project-search';

class GrantsDashboard extends Component {
  constructor(props) {
    super(props);
    this.selectProject = this.selectProject.bind(this);
    this.performProjectChecks = this.performProjectChecks.bind(this);
    this.state = {
      project: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.project !== this.state.project) {
      this.performProjectChecks();
    }
  }

  render() {
    console.info('yea')
    return (
      <section>
        <ProjectSearch onSelect={this.selectProject} />
      </section>
    );
  }

  performProjectChecks() {
    console.log('Project selected', this.state.project);
  }

  selectProject(project) {
    this.setState({ project });
  }

}

export default GrantsDashboard;
