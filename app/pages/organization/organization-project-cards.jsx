import React from 'react';
import Translate from 'react-translate-component';
import ProjectCard from '../../partials/project-card';

export const OrganizationProjectCards = ({ errorFetchingProjects, fetchingProjects, projects, projectAvatars }) => {
  if (fetchingProjects) {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.loading" /></p>
      </div>);
  } else if (!fetchingProjects && projects && !projects.length) {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.none" /></p>
      </div>);
  } else if (projects && projects.length > 0) {
    return (
      <div className="project-card-list">
        {projects.map((project) => {
          let projectAvatar = projectAvatars.find(avatar => avatar.links.linked.id === project.id);
          if (!projectAvatar) {
            projectAvatar = { src: '' };
          }
          return (
            <ProjectCard key={project.id} project={project} imageSrc={projectAvatar.src} />);
        })}
      </div>);
  } else {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.error" /></p>
        {errorFetchingProjects &&
          <p>
            <code>{errorFetchingProjects.toString()}</code>
          </p>}
      </div>);
  }
};

OrganizationProjectCards.propTypes = {
  errorFetchingProjects: React.PropTypes.shape({
    message: React.PropTypes.string
  }),
  fetchingProjects: React.PropTypes.bool,
  projects: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      display_name: React.PropTypes.string
    })
  ),
  projectAvatars: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      src: React.PropTypes.string
    })
  )
};

export default OrganizationProjectCards;
