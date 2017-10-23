import React from 'react';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
import Translate from 'react-translate-component';
import Thumbnail from '../../components/thumbnail';
import SocialIcons from '../../lib/social-icons';
import ProjectCard from '../../partials/project-card';

const AVATAR_SIZE = 100;

export const OrganizationProjectCards = ({ errorFetchingProjects, fetchingProjects, projects }) => {
  if (fetchingProjects) {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.loading" /></p>
      </div>);
  } else if (errorFetchingProjects) {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.error" /></p>
        <p>
          <code>{errorFetchingProjects.toString()}</code>
        </p>
      </div>);
  } else if (!fetchingProjects && !projects.length) {
    return (
      <div className="organization-page__projects-status">
        <p><Translate content="organization.home.projects.none" /></p>
      </div>);
  } else {
    return (
      <div className="project-card-list">
        {projects.map(project =>
          <ProjectCard key={project.id} project={project} />
        )}
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
  )
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
    const [aboutPage] = this.props.organizationPages.filter(page => page.url_key === 'about');
    let rearrangedLinks = [];
    if (this.props.organization.urls) {
      rearrangedLinks = this.props.organization.urls.sort((a, b) => {
        if (a.path && !b.path) {
          return 1;
        }
        return 0;
      });
    }

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
              <p className="organization-hero__description">{this.props.organization.description}</p>
            </div>
          </div>
        </section>

        <section className="resources-container">
          {this.props.collaborator &&
            <label className="organization-page__toggle" htmlFor="collaborator view">
              <input
                onChange={() => this.props.toggleCollaboratorView()}
                type="checkbox"
                value={!this.props.collaboratorView}
              />
              <Translate content="organization.home.viewToggle" />
            </label>}
          <OrganizationProjectCards
            errorFetchingProjects={this.props.errorFetchingProjects}
            fetchingProjects={this.props.fetchingProjects}
            projects={this.props.organizationProjects}
          />
        </section>

        <section className="organization-details">
          <div className="organization-page__container">
            <div className="organization-researcher-words">
              <Translate className="organization-details__heading" content="project.home.researcher" />
              <div className="organization-researcher-words__container">
                <img
                  className="organization-researcher-words__avatar"
                  role="presentation"
                  src="/assets/simple-avatar.png"
                />
                <span
                  className="organization-researcher-words__quote"
                >
                  &quot;{'Sample quote from researcher with call to action!'}&quot;
                </span>
              </div>
            </div>
            <div className="organization-details__content">
              <h4 className="organization-details__heading">
                {this.props.organization.display_name} <Translate content="organization.home.introduction" />
              </h4>
              {this.props.organization.introduction &&
                <Markdown project={this.props.organization}>{this.props.organization.introduction}</Markdown>}
            </div>
          </div>

          <div className="organization-page__container">
            <div className="project-metadata">
              <span className="organization-details__heading">
                {this.props.organization.display_name}{' '}<Translate content="project.home.metadata.statistics" />
              </span>
              <div className="project-metadata-stats">
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{123}</div>
                  <div className="project-metadata-stat__label">
                    <Translate content="project.home.metadata.volunteers" />
                  </div>
                </div>
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{456}</div>
                  <div className="project-metadata-stat__label">
                    <Translate content="project.home.metadata.classifications" />
                  </div>
                </div>
                <div className="project-metadata-stat">
                  <div className="project-metadata-stat__value">{789}</div>
                  <div className="project-metadata-stat__label">
                    <Translate content="project.home.metadata.subjects" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="organization-page__container">
            <div className="organization-details__content">
              <h4 className="organization-details__heading">
                <Translate content="project.home.about" with={{ title: this.props.organization.display_name }} />
              </h4>
              {aboutPage &&
                <div>
                  <Markdown className={aboutContentClass} project={this.props.organization}>
                    {aboutPage.content}
                  </Markdown>
                  <button
                    className="standard-button organization-details__button"
                    onClick={() => this.toggleReadMore()}
                  >
                    {this.state.readMore ?
                      <Translate content="organization.home.readLess" /> :
                      <Translate content="organization.home.readMore" />}
                  </button>
                </div>}
            </div>
            <div className="organization-researcher-words">
              <h4 className="organization-details__heading"><Translate content="organization.home.links" /></h4>
              <div className="organization-details__links">
                {(rearrangedLinks.length > 0) && rearrangedLinks.map((link, i) => {
                  let iconForLabel;
                  let label;
                  if (link.path) {
                    iconForLabel = SocialIcons[link.site] || 'external-link';
                    label = <span> - @{link.path}</span>;
                  } else {
                    iconForLabel = 'external-link';
                    label = <span> - {link.label}</span>;
                  }
                  return (
                    <a
                      key={link.key || link.path}
                      className="organization-details__link organization-details__link"
                      href={`${link.url}`}
                      target={`${this.props.organization.id}${link.url}`}
                      rel="noopener noreferrer"
                    >
                      <i className={`fa fa-${iconForLabel} fa-fw fa-2x`} />
                      {label}
                    </a>);
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

OrganizationPage.defaultProps = {
  collaborator: false,
  collaboratorView: true,
  errorFetchingProjects: {},
  fetchingProjects: false,
  organization: {},
  organizationAvatar: {},
  organizationBackground: {},
  organizationPages: [],
  organizationProjects: [],
  toggleCollaboratorView: () => {}
};

OrganizationPage.propTypes = {
  collaborator: React.PropTypes.bool,
  collaboratorView: React.PropTypes.bool,
  errorFetchingProjects: React.PropTypes.shape({
    message: React.PropTypes.string
  }),
  fetchingProjects: React.PropTypes.bool,
  organization: React.PropTypes.shape({
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    id: React.PropTypes.string,
    introduction: React.PropTypes.string,
    urls: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        url: React.PropTypes.string
      })
    )
  }).isRequired,
  organizationAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationBackground: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  organizationPages: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      content: React.PropTypes.string
    })
  ),
  organizationProjects: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      display_name: React.PropTypes.string
    })
  ),
  toggleCollaboratorView: React.PropTypes.func
};

export default OrganizationPage;
