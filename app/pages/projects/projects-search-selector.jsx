import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import Select from 'react-select';

class SearchSelector extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.searchByName = this.searchByName.bind(this);
  }

  onChange(option) {
    const onChange = this.props.onChange || this.navigateToProject;
    onChange(option.value);
  }

  navigateToProject(project) {
    const { redirect, slug } = project;
    if (redirect) {
      window.location.assign(redirect);
    } else {
      browserHistory.push(['/projects', slug].join('/'));
    }
  }

  searchByName(value) {
    const { options } = this.props;
    const query = {
      search: `%${value}%`,
      cards: true,
      ...options
    };
    if ((value != null ? value.trim().length : undefined) > 3) {
      return apiClient.type('projects').get(query, {
        page_size: 10
      }).then((projects) => {
        const opts = projects.map(project => ({
          value: project,
          label: project.display_name
        }));
        return { options: opts };
      });
    } else {
      return Promise.resolve({ options: [] });
    }
  }

  render() {
    const { className } = this.props;

    return (
      <Select.Async
        multi={false}
        name="resourcesid"
        placeholder="Name:"
        value=""
        searchPromptText="Search by name"
        loadOptions={this.searchByName}
        onChange={this.onChange}
        className={`search card-search standard-input ${className}`}
      />
    );
  }
}

SearchSelector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.shape({})
};

SearchSelector.defaultProps = {
  className: '',
  onChange: undefined,
  options: {}
};

export default SearchSelector;
