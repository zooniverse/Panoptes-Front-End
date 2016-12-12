import React, { Component, PropTypes } from 'react';
import HomePageSection from './generic-section';
import ProjectIcon from '../../components/project-icon';

const RecentProjectsSection = ({ onClose, projects, updatedProjects }) => {
  return (
    <HomePageSection
      title="Recent projects"
      onClose={onClose}
    >
      {(updatedProjects === 0)
      ? <div className="home-page-section__header-label">
          <p> You have no recent projects. </p>
        </div>
      : <div className="project-card-list">
        {updatedProjects.map((project) => {
          return (
            <span key={project.id}>
              <ProjectIcon project={project} badge={project.classifications} />
              &ensp;
            </span>
          );
        })}
      </div>}
    </HomePageSection>
  );
};

RecentProjectsSection.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  projects: React.PropTypes.array.isRequired,
  updatedProjects: React.PropTypes.array.isRequired,
};

RecentProjectsSection.defaultProps = {
  projects: [],
  updatedProjects: [],
};

export default RecentProjectsSection;
