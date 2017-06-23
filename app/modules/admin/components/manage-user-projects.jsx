import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Heading from 'grommet/components/Heading';

function ManageUserProjects({ projects }) {
  return (
    <div>
      <Heading tag="h3">Projects</Heading>
      <ul>
        {projects.map(project => <ProjectLink project={project} key={project.id} />)}
      </ul>
    </div>
  );
}

ManageUserProjects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
};

function ProjectLink({ project }) {
  return (
    <li>
      <Link to={`/projects/${project.slug}`}>
        {project.display_name}
      </Link>
    </li>
  );
}

ManageUserProjects.propTypes = {
  project: PropTypes.shape({
    display_name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
};

export default ManageUserProjects;
