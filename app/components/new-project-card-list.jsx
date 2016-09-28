import React from 'react';
import ProjectCard from '../partials/project-card';

const ProjectCardList = React.createClass({
  propTypes: {
    projects: React.PropTypes.array,
  },

  defaultProps: {
    projects: [],
  },

  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  },

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  },

  render() {
    return (
      <div className="project-card-list">
        {this.props.projects.map(project => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>)
        )}
      </div>
    );
  },
});

export default ProjectCardList;
