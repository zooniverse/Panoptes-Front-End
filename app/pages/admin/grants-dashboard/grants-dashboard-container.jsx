import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

import ProjectSearch from './project-search';
import * as helpers from './helpers';
import RetirementRules from './retirement-rules';

class GrantsDashboard extends Component {
  constructor(props) {
    super(props);
    this.selectProject = this.selectProject.bind(this);
    this.performProjectChecks = this.performProjectChecks.bind(this);
    this.state = {
      project: null,
      hasRetirementBeenChanged: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.project !== this.state.project) {
      this.performProjectChecks();
    }
  }

  render() {
    return (
      <section class="admin-tab-content">
        <ProjectSearch onSelect={this.selectProject} />
        
        {(this.state.hasRetirementBeenChanged.length > 0) && 
          <RetirementRules data={this.state.hasRetirementBeenChanged} />}
          
      </section>
    );
  }

  performProjectChecks() {
    const checks = [
      {
        stateName: 'hasRetirementBeenChanged',
        promise: helpers.hasRetirementBeenChanged.bind(undefined, this.state.project),
      }
    ];

    return Promise.all(checks.map(performCheck))
      .then(checkResults => {
        const stateObject = checkResults.reduce((newState, check) => {
          newState[check.stateName] = check.data;
          return newState;
        }, {});
        this.setState(stateObject);
      })
      .catch(error => console.error(error));
  }

  selectProject(project) {
    this.setState({ project });
  }

}

function performCheck(check) {
  return check.promise()
    .then(response => ({
      stateName: check.stateName,
      data: response,
    }))
    .catch(error => console.error(error));
}

export default GrantsDashboard;
