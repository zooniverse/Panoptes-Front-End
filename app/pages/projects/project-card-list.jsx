import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProjectCard from '../../partials/project-card';

class ProjectCardList extends Component {
  render() {
    return (
      <div className="project-card-list">
        {this.props.projects.map(project =>
          <ProjectCard key={project.id} project={project} />
        )}
      </div>
    );
  }
}

ProjectCardList.propTypes = {
  projects: PropTypes.array.isRequired,
};

ProjectCardList.defaultProps = {
  projects: [],
};

export default ProjectCardList;