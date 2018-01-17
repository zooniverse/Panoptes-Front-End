import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import Select from 'react-select';

class SearchSelector extends Component {
  constructor(props) {
    super(props);
    this.navigateToProject = this.navigateToProject.bind(this);
    this.searchByName = this.searchByName.bind(this);
  }

  navigateToProject(option) {
    const projectUrl = option.value;
    if (projectUrl.match(/^http.*/)) {
      window.location.assign(projectUrl);
    } else {
      browserHistory.push(['/projects', projectUrl].join('/'));
    }
  }

  searchByName(value) {
    const query = {
      search: '%' + value + '%',
      cards: true,
      launch_approved: !apiClient.params.admin ? true : undefined,
    };
    if ((value != null ? value.trim().length : undefined) > 3) {
      return apiClient.type('projects').get(query, {
        page_size: 10,
      }).then(projects => {
        const opts = projects.map(project => ({
          value: project.redirect || project.slug,
          label: project.display_name
        }));
        return { options: opts };
      });
    } else {
      return Promise.resolve({ options: [] });
    }
  }

  render() {
    return (
      <Select.Async
        multi={false}
        name="resourcesid"
        placeholder="Name:"
        value=""
        searchPromptText="Search by name"
        loadOptions={this.searchByName}
        onChange={this.navigateToProject}
        className="search card-search standard-input"
      />
    );
  }
}

SearchSelector.propTypes = {
  onChange: PropTypes.func,
  query: PropTypes.func,
};

export default SearchSelector;