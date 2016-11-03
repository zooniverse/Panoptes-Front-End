import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import Select from 'react-select';
import debounce from 'debounce';

class SearchSelector extends Component {
  constructor(props) {
    super(props);
    this.navigateToProject = this.navigateToProject.bind(this);
    this.searchByName = this.searchByName.bind(this);
  }

  navigateToProject(projectId) {
    apiClient.type('projects').get(projectId)
      .then(project => {
        if (project.redirect != null && project.redirect.length !== 0) {
          return browserHistory.push(project.redirect);
        }
        return browserHistory.push(['/projects', project.slug].join('/'));
      });
  }

  searchByName(value, callback) {
    const query = {
      search: '%' + value + '%',
      cards: true,
      launch_approved: !apiClient.params.admin ? true : undefined,
    };
    if ((value != null ? value.trim().length : undefined) > 3) {
      apiClient.type('projects').get(query, {
        page_size: 10,
      }).then(projects => {
        const opts = projects.map(project => ({
          value: project.id,
          label: project.display_name,
          project,
        }));
        return callback(null, {
          options: opts || [],
        });
      });
    }
    return callback(null, {
      options: [],
    });
  }

  render() {
    return (
      <Select
        multi={false}
        name="resourcesid"
        placeholder="Name:"
        value=""
        searchPromptText="Search by name"
        closeAfterClick
        asyncOptions={debounce(this.searchByName, 2000)}
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
