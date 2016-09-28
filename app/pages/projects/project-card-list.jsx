import React, { Component, PropTypes } from 'react';
import ProjectCard from '../../partials/project-card';

class ProjectCardList extends Component {
  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  }

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
