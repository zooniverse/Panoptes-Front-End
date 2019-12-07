import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import ProjectCard from '../../partials/project-card';

export const OrganizationProjectCards = ({
  category,
  errorFetchingProjects,
  fetchingProjects,
  projects,
  projectAvatars,
  state
}) => {
  if (fetchingProjects) {
    return (
      <div className="organization-page__project-cards-message">
        <p><Translate content="organization.home.projects.loading" /></p>
      </div>
    );
  } else if (!fetchingProjects && projects && !projects.length) {
    return (
      <div className="organization-page__project-cards-message">
        <p><Translate content="organization.home.projects.none" with={{ category, state }} /></p>
      </div>
    );
  } else if (projects && projects.length > 0) {
    return (
      <div className="organization-page__project-cards-section">
        {projects.map((project) => {
          let projectAvatar = projectAvatars.find(avatar => avatar.links.linked.id === project.id);
          if (!projectAvatar) {
            projectAvatar = { src: '' };
          }
          return (
            <ProjectCard key={project.id} project={project} imageSrc={projectAvatar.src} />);
        })}
      </div>
    );
  } else {
    return (
      <div className="organization-page__project-cards-message">
        <p><Translate content="organization.home.projects.error" /></p>
        {errorFetchingProjects
          && (
            <p>
              <code>
                {errorFetchingProjects.toString()}
              </code>
            </p>
          )}
      </div>
    );
  }
};

OrganizationProjectCards.propTypes = {
  category: PropTypes.string,
  errorFetchingProjects: PropTypes.shape({
    message: PropTypes.string
  }),
  fetchingProjects: PropTypes.bool,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ),
  projectAvatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string
    })
  ),
  state: PropTypes.string
};

export default OrganizationProjectCards;
