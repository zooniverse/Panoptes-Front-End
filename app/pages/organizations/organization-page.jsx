import React from 'react';
import { Link } from 'react-router';
import { Markdown } from 'markdownz';
import ProjectCardList from '../projects/project-card-list';
import OrganizationMetaData from './organization-metadata';
import Thumbnail from '../../components/thumbnail';

const AVATAR_SIZE = 75;

const OrganizationPage = ({ organization, organizationAvatar, organizationBackground }) => (
  <div className="organization-page">
    <div className="organization-background" style={{ backgroundImage: `url(${organizationBackground.src})` }} />
    <div className="organization-home">
      <section className="organization-hero">
        <div>
          <nav className="organization-hero__nav tabbed-content-tab">
            <Link to={`/organizations/${organization.id}`}>
              {organizationAvatar &&
                <Thumbnail
                  src={organizationAvatar.src}
                  className="avatar organization-hero__avatar"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />}
            </Link>
          </nav>
          <div className="organization-hero__text">
            <h1 className="organization-hero__text--name">{organization.display_name}</h1>
            <h3 className="organization-hero__text--description">{organization.description}</h3>
          </div>
        </div>
      </section>
      <section className="resources-container">
        <div className="organization-projects">
          <ProjectCardList projects={organization.projects} />
        </div>
      </section>
      <section className="organization-details">
        <div className="organization-details__stats">
          <OrganizationMetaData organization={organization} />
        </div>
        <div className="organization-details__about">
          <h5 className="organization-details__about-title">ABOUT {organization.display_name}</h5>
          <div className="organization-details__about-text">
            <Markdown>
              {organization.introduction}
            </Markdown>
          </div>
        </div>
      </section>
    </div>
  </div>
);

OrganizationPage.defaultProps = {
  organization: {},
  organizationAvatar: null,
  organizationBackground: null
};

OrganizationPage.propTypes = {
  organization: React.PropTypes.shape({
    projects: React.PropTypes.arrayOf(React.PropTypes.object),
    description: React.PropTypes.string,
    display_name: React.PropTypes.string
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;
