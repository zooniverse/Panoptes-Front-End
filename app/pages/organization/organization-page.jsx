import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { Markdown } from 'markdownz';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import Translate from 'react-translate-component';

import OrganizationProjectCards from './organization-project-cards';
import OrganizationMetadata from './organization-metadata';
import Thumbnail from '../../components/thumbnail';
import ExternalLinksBlockContainer from '../../components/ExternalLinksBlock';
import ZooniverseLogo from '../../partials/zooniverse-logo';

const AVATAR_SIZE = 120;

class OrganizationPage extends React.Component {
  constructor() {
    super();

    this.state = {
      category: '',
      finished: false,
      paused: false
    };
  }

  toggleFinished() {
    const { finished } = this.state;
    this.setState({ finished: !finished });
  }

  togglePaused() {
    const { paused } = this.state;
    this.setState({ paused: !paused });
  }

  handleCategoryChange(category) {
    this.setState({ category });
  }

  calculateClasses(buttonCategory) {
    const { category } = this.state;
    const list = classnames(
      'standard-button',
      'organization-page__category-button',
      {
        'organization-page__category-button--active': (buttonCategory === category)
          || (!category && (buttonCategory === 'All'))
      }
    );
    return list;
  }

  render() {
    const {
      collaborator,
      collaboratorView,
      errorFetchingProjects,
      fetchingProjects,
      organization,
      organizationAvatar,
      organizationBackground,
      organizationPages,
      organizationProjects,
      projectAvatars,
      quoteObject,
      toggleCollaboratorView
    } = this.props;
    const {
      category,
      finished,
      paused,
      readMore
    } = this.state;

    let projects = organizationProjects;
    if (category) {
      projects = organizationProjects.filter(project => project.tags.some(tag => tag === category.toLowerCase()));
    }

    const activeProjects = projects.filter(project => project.state === 'live');
    const finishedProjects = projects.filter(project => project.state === 'finished');
    const pausedProjects = projects.filter(project => project.state === 'paused');

    const researcherAvatarSrc = quoteObject.researcherAvatar || '/assets/simple-avatar.png';

    const [aboutPage] = organizationPages.filter(page => page.url_key === 'about');

    return (
      <div className="organization-page">
        <Helmet title={organization.display_name} />

        <section
          className="organization-hero"
          style={{ backgroundImage: `url(${organizationBackground.src})` }}
        >
          <div className="organization-hero__background-gradient">
            {organization.announcement && (
              <Markdown tag="div" className="informational project-announcement-banner">
                {organization.announcement}
              </Markdown>
            )}
            <div className="organization-hero__container">
              {organizationAvatar.src ? (
                <Thumbnail
                  alt={`Organization icon for ${organization.display_name}`}
                  src={organizationAvatar.src}
                  className="organization-hero__avatar"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />
              ) : (
                <ZooniverseLogo className="organization-hero__avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />
              )}
              <div className="organization-hero__wrapper">
                <h1 className="organization-hero__title">{organization.display_name}</h1>
                <p className="organization-hero__description">{organization.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="organization-page__main">
          <section className="organization-page__projects">
            {collaborator && (
              <label className="organization-page__toggle" htmlFor="collaborator view">
                <input
                  id="collaborator view"
                  onChange={() => toggleCollaboratorView()}
                  type="checkbox"
                  value={!collaboratorView}
                />
                <Translate content="organization.home.viewToggle" />
              </label>
            )}
            {organization.categories && organization.categories.length > 0 && (
              <>
                <Translate
                  className="organization-details__content-heading"
                  component="h4"
                  content="organization.home.projects.projectCategory"
                />
                <div className="organization-page__categories" ref={(node) => { this.categories = node; }}>
                  <label
                    className={this.calculateClasses('All')}
                    htmlFor="all"
                  >
                    <input
                      className="organization-page__category-button--hidden"
                      id="all"
                      name="category"
                      onChange={this.handleCategoryChange.bind(this, '')}
                      type="radio"
                    />
                    <Translate content="organization.home.projects.all" />
                  </label>
                  {organization.categories.map(buttonCategory => (
                    <label
                      className={this.calculateClasses(buttonCategory)}
                      htmlFor={buttonCategory}
                      key={buttonCategory}
                    >
                      <input
                        className="organization-page__category-button--hidden"
                        id={buttonCategory}
                        name="category"
                        onChange={this.handleCategoryChange.bind(this, buttonCategory)}
                        type="radio"
                      />
                      {buttonCategory}
                    </label>
                  ))}
                </div>
              </>
            )}
            <OrganizationProjectCards
              category={category}
              errorFetchingProjects={errorFetchingProjects}
              fetchingProjects={fetchingProjects}
              projects={activeProjects}
              projectAvatars={projectAvatars}
              state="active"
            />

            <div className="organization-page__section-heading">
              <Translate
                className="organization-page__section-title"
                content="organization.home.projects.paused"
              />
              <button
                className="standard-button organization-page__section-button"
                onClick={() => this.togglePaused()}
                type="button"
              >
                {paused ? (
                  <>
                    <i className="fa fa-chevron-up fa-lg" />
                    {' '}
                    <Translate
                      content="organization.home.projects.hideSection"
                    />
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-down fa-lg" />
                    {' '}
                    <Translate
                      content="organization.home.projects.showSection"
                    />
                  </>
                )}
              </button>
            </div>
            {paused && (
              <OrganizationProjectCards
                category={category}
                errorFetchingProjects={errorFetchingProjects}
                fetchingProjects={fetchingProjects}
                projects={pausedProjects}
                projectAvatars={projectAvatars}
                state="paused"
              />
            )}

            <div className="organization-page__section-heading">
              <Translate
                className="organization-page__section-title"
                content="organization.home.projects.finished"
              />
              <button
                className="standard-button organization-page__section-button"
                onClick={() => this.toggleFinished()}
                type="button"
              >
                {finished ? (
                  <>
                    <i className="fa fa-chevron-up fa-lg" />
                    {' '}
                    <Translate
                      content="organization.home.projects.hideSection"
                    />
                  </>
                ) : (
                  <>
                    <i className="fa fa-chevron-down fa-lg" />
                    {' '}
                    <Translate
                      content="organization.home.projects.showSection"
                    />
                  </>
                )}
              </button>
            </div>
            {finished && (
              <OrganizationProjectCards
                category={category}
                errorFetchingProjects={errorFetchingProjects}
                fetchingProjects={fetchingProjects}
                projects={finishedProjects}
                projectAvatars={projectAvatars}
                state="finished"
              />
            )}
          </section>

          <hr />

          <section className="organization-details">
            <Translate
              className="organization-page__section-title"
              content="organization.home.learn"
              with={{
                title: organization.display_name
              }}
            />
            <div className="organization-details__container">
              {quoteObject && quoteObject.quote && (
                <div className="organization-researcher-words">
                    <Translate
                      className="organization-details__content-heading"
                      content="organization.home.researcher"
                    />
                  <div className="organization-researcher-words__container">
                    <img
                      className="organization-researcher-words__avatar"
                      alt="presentation"
                      src={researcherAvatarSrc}
                    />
                    <span
                      className="organization-researcher-words__quote"
                    >
                      &quot;
                      {quoteObject.quote}
                      &quot;
                    </span>
                  </div>
                  <Link
                    className="organization-researcher-words__attribution"
                    to={quoteObject.slug}
                  >
                    {' - '}
                    {quoteObject.displayName}
                  </Link>
                </div>
              )}
                  <Translate
                    className="organization-details__content-heading"
                    component="h4"
                    content="organization.home.introduction"
                    with={{ title: organization.display_name }}
                  />
                {organization.introduction && (
                  <Markdown project={organization}>{organization.introduction}</Markdown>
                )}
              </div>
            </div>

            <OrganizationMetadata
              displayName={organization.display_name}
              projects={organizationProjects}
            />

            <div className="organization-details__container">
              <div className="organization-details__content">
                <Translate
                  className="organization-details__content-heading"
                  component="h4"
                  content="organization.home.about"
                  with={{ title: organization.display_name }}
                />
                {aboutPage && (
                  <Markdown
                    className="organization-details__about-content"
                    project={organization}
                  >
                    {aboutPage.content}
                  </Markdown>
                )}
              </div>
            </div>
            <div className="organization-details__container">
              {organization.urls && organization.urls.length && (
                <ExternalLinksBlockContainer
                  header={(
                    <Translate
                      className="organization-details__heading"
                      content="organization.home.links"
                      component="h4"
                    />
                  )}
                  resource={organization}
                />
              )}
            </div>
          </section>
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
  organizationAvatar: {},
  organizationBackground: {},
  organizationPages: [],
  organizationProjects: [],
  projectAvatars: [],
  quoteObject: {},
  toggleCollaboratorView: () => {}
};

OrganizationPage.propTypes = {
  collaborator: PropTypes.bool,
  collaboratorView: PropTypes.bool,
  errorFetchingProjects: PropTypes.shape({
    message: PropTypes.string
  }),
  fetchingProjects: PropTypes.bool,
  organization: PropTypes.shape({
    announcement: PropTypes.string,
    categories: PropTypes.arrayOf(
      PropTypes.string
    ),
    description: PropTypes.string,
    display_name: PropTypes.string,
    id: PropTypes.string,
    introduction: PropTypes.string,
    urls: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string
      })
    )
  }).isRequired,
  organizationAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationBackground: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationPages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string
    })
  ),
  organizationProjects: PropTypes.arrayOf(
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
  quoteObject: PropTypes.shape({
    displayName: PropTypes.string,
    researcherAvatar: PropTypes.string,
    quote: PropTypes.string,
    slug: PropTypes.string
  }),
  toggleCollaboratorView: PropTypes.func
};

export default OrganizationPage;
