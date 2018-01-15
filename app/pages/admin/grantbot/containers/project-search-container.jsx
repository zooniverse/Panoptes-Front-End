import PropTypes from 'prop-types';
import React from 'react';
import { Async as SelectAsync } from 'react-select';
import apiClient from 'panoptes-client/lib/api-client';

class ProjectSearch extends React.Component {
  constructor(props) {
    super(props);
    this.searchProjects = this.searchProjects.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      selectedProject: null,
      projectsCache: []
    };
  }

  searchProjects(value) {
    const returnObject = { options: [] };
    
    const searchOptions = {
      page_size: 10,
      search: value, 
    };

    return new Promise((resolve, reject) => {
      if (!value) {
        return resolve(returnObject);
      }
      
      return apiClient.type('projects').get(searchOptions)
        .then(projects => {
          this.setState({ projectsCache: projects });
          returnObject.options = projects.map(({ id, slug }) => ({
            value: id,
            label: slug,
          }))
          return resolve(returnObject);
        })
        .catch(error => console.error(error));
    });
  }

  onChange(selected) {
    this.setState({ selectedProject: selected });

    if (this.props.onSelect) {

      const selectedProjectResource = this.state.projectsCache.find(project => 
        project.id === selected.value);

      if (selectedProjectResource) {
        this.props.onSelect(selectedProjectResource);
      } else {
        apiClient.type('projects').get(selected.value)
          .then(this.props.onSelect)
          .catch(error => console.error(error));
      }
    }
  }

  render() {
    return (
      <SelectAsync
        autoload={false}
        className="search standard-input"
        closeAfterClick={true}
        loadOptions={this.searchProjects}
        matchProp={'label'}
        onChange={this.onChange}
        name="projects"
        placeholder="Start typing a project slug..."
        searchPromptText="Start typing a project slug..."
        value={this.state.selectedProject}
      />
    );
  }
}

ProjectSearch.propTypes = {
  onSelect: PropTypes.func,
};

export default ProjectSearch;