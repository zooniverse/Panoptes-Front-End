import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import Thumbnail from '../../components/thumbnail';
import ProjectCard from '../../partials/project-card';

const AVATAR_SIZE = 100;

const OrganizationProjectCard = ({ collaboratorView, project }) => {
  let statusClass;
  let statusLabel;
  let statusMessage;
  if (project.launch_approved === true) {
    statusClass = 'status-banner--success';
    statusLabel = 'Launch Approved';
    statusMessage = `This project is launch approved and visible to all volunteers.
    You are a collaborator on this project.`;
  } else if (project.launch_approved === false) {
    statusClass = 'status-banner--warning';
    statusLabel = 'NOT PUBLICLY VISIBILE';
    statusMessage = `This project is not launch approved, therefore not visible to the public.
    You are a collaborator on this project.`;
  } else {
    statusClass = 'status-banner--alert';
    statusLabel = 'UNKNOWN';
    statusMessage = `You are not a collaborator on this project, therefore the status is unknown.
    Please contact other organization collaborators to determine who is a collaborator on this project,
    so they can add you as a collaborator to the project as well.`;
  }

  return (
    <div className="organization-project">
      <ProjectCard project={project} />
      {collaboratorView &&
        <TriggeredModalForm trigger={statusLabel} triggerProps={{ className: `status-banner ${statusClass}` }}>
          <p>{statusMessage}</p>
        </TriggeredModalForm>}
    </div>);
};

OrganizationProjectCard.propTypes = {
  collaboratorView: React.PropTypes.bool,
  project: React.PropTypes.shape({
    id: React.PropTypes.string,
    display_name: React.PropTypes.string
  })
};

const OrganizationPage = ({ collaboratorView, organization, organizationAvatar, organizationBackground }) =>
  <div className="organization-page">
    <section
      className="organization-hero"
      style={{ backgroundImage: `url(${organizationBackground.src})` }}
    >
      <div className="organization-hero__container">
        {organizationAvatar &&
          <Thumbnail
            src={organizationAvatar.src}
            className="avatar organization-hero__avatar"
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
          />}
        <div>
          <h1 className="organization-hero__title">{organization.display_name}</h1>
          <h5 className="organization-hero__description">{organization.description}</h5>
        </div>
      </div>
    </section>
    <section className="resources-container">
      <div className="project-card-list">
        {organization.projects.map(project =>
          <OrganizationProjectCard
            collaboratorView={collaboratorView}
            key={project.id}
            project={project}
          />)}
      </div>
    </section>
    <section className="organization-details">
      <p>Details like description, stats and about info will go here, omitting to keep PR compact.</p>
    </section>
  </div>;

OrganizationPage.defaultProps = {
  collaboratorView: false,
  organization: {},
  organizationAvatar: null,
  organizationBackground: null
};

OrganizationPage.propTypes = {
  collaboratorView: React.PropTypes.bool,
  organization: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  })
};

export default OrganizationPage;
