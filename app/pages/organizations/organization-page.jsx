import React from 'react';
import ProjectCardList from '../projects/project-card-list';
import OrganizationMetaData from './organization-metadata';
import Thumbnail from '../../components/thumbnail';

const AVATAR_SIZE = 500;

const OrganizationPage = ({ organization, organizationAvatar }) => (
  <div className="secondary-page all-resources-page">
    <section className="hero projects-hero">
      <div className="hero-container">
        {organizationAvatar &&
          <Thumbnail src={organizationAvatar.src} className="avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />}
        <h1>{organization.display_name}</h1>
        <p>{organization.description}</p>
      </div>
    </section>
    <section className="resources-container">
      <div className="organization-project-list">
        <ProjectCardList projects={organization.projects} />
      </div>
    </section>
    <section className="organization-metadata-about-container">
      <OrganizationMetaData organization={organization} />
      <div className="organization-about">
        <h1>ABOUT {organization.display_name}</h1>
        <div className="organization-about--text">
          {organization.introduction}
        </div>
      </div>
    </section>
  </div>
);

OrganizationPage.defaultProps = {
  organization: {},
  organizationAvatar: null
};

OrganizationPage.propTypes = {
  organization: React.PropTypes.shape({
    projects: React.PropTypes.arrayOf(React.PropTypes.object),
    description: React.PropTypes.string,
    display_name: React.PropTypes.string
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;
