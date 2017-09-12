import React from 'react';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
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
    statusLabel = 'launch approved';
    statusMessage = `This project is launch approved and visible to all volunteers.
    You are a collaborator on this project.`;
  } else if (project.launch_approved === false) {
    statusClass = 'status-banner--warning';
    statusLabel = 'not launch approved';
    statusMessage = `This project is not launch approved, therefore not visible to the public.
    You are a collaborator on this project.`;
  } else {
    statusClass = 'status-banner--alert';
    statusLabel = 'unknown';
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

class OrganizationPage extends React.Component {
  constructor() {
    super();

    this.state = {
      readMore: false
    };
  }

  toggleReadMore() {
    this.setState({ readMore: !this.state.readMore });
  }

  render() {
    const aboutContentClass = classnames(
      'organization-details__about-content',
      { 'organization-details__about-content--expanded': this.state.readMore });

    return (
      <div className="organization-page">
        <section
          className="organization-hero"
          style={{ backgroundImage: `url(${this.props.organizationBackground.src})` }}
        >
          <div className="organization-hero__container">
            {this.props.organizationAvatar &&
              <Thumbnail
                src={this.props.organizationAvatar.src}
                className="avatar organization-hero__avatar"
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
              />}
            <div>
              <h1 className="organization-hero__title">{this.props.organization.display_name}</h1>
              <h5 className="organization-hero__description">{this.props.organization.description}</h5>
            </div>
          </div>
        </section>

        <section className="resources-container">
          <div className="project-card-list">
            {this.props.organization.projects.map(project =>
              <OrganizationProjectCard
                collaboratorView={this.props.collaboratorView}
                key={project.id}
                project={project}
              />)}
          </div>
        </section>

        <section className="organization-details">
          <div className="organization-page__container">
            <div className="project-home-page__researcher-words">
              <h4 className="organization-details__heading">Words from the researcher</h4>
              <div>
                <img role="presentation" src="/assets/simple-avatar.png" />
                <span>&quot;{'Sample quote from researcher with call to action!'}&quot;</span>
              </div>
            </div>
            <div className="organization-details__content">
              <h4 className="organization-details__heading">{this.props.organization.display_name} Introduction</h4>
              {this.props.organization.introduction &&
                <Markdown project={this.props.organization}>{this.props.organization.introduction}</Markdown>}
            </div>
          </div>

          <div className="organization-page__container">
            <div className="project-metadata">
              <span className="organization-details__heading">
                {this.props.organization.display_name}{' '}Statistics
              </span>
              <div className="project-metadata-stats">
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{123}</div>
                  <div className="project-metadata-stat__label">Volunteers</div>
                </div>
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{456}</div>
                  <div className="project-metadata-stat__label">Classifications</div>
                </div>
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{789}</div>
                  <div className="project-metadata-stat__label">Subjects</div>
                </div>
              </div>
            </div>
          </div>

          <div className="organization-page__container">
            <div className="organization-details__content">
              <h4 className="organization-details__heading">About {this.props.organization.display_name}</h4>
              {this.props.organization.aboutPage &&
                <div>
                  <Markdown className={aboutContentClass} project={this.props.organization}>
                    {this.props.organization.aboutPage}
                  </Markdown>
                  <button
                    className="standard-button organization-details__button"
                    onClick={() => this.toggleReadMore()}
                  >
                    {this.state.readMore ? 'Read Less' : 'Read More'}
                  </button>
                </div>}
            </div>
            <div className="project-home-page__researcher-words">
              <h4 className="organization-details__heading">Links</h4>
              <ul>
                <li className="organization-details__link">Blog</li>
                <li className="organization-details__link"><i className="fa fa-facebook fa-fw" />- @orgFacebook</li>
                <li className="organization-details__link"><i className="fa fa-twitter fa-fw" />- @orgTwitter</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

OrganizationPage.defaultProps = {
  collaboratorView: false,
  organization: {},
  organizationAvatar: null,
  organizationBackground: null
};

OrganizationPage.propTypes = {
  collaboratorView: React.PropTypes.bool,
  organization: React.PropTypes.shape({
    aboutPage: React.PropTypes.string,
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
