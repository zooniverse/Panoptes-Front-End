import React from 'react';
import ProjectCard from '../partials/project-card';

const ProjectIcon = (props) => {
  return (
    <span className="stats-project-icon">
      <ProjectCard project={props.project} href={props.linkTo} />
      {!!props.badge && <div className="badge">{props.badge}</div>}
    </span>
  );
};

ProjectIcon.propTypes = {
  project: React.PropTypes.object,
  badge: React.PropTypes.number,
  linkTo: React.PropTypes.string
};

export default ProjectIcon;
