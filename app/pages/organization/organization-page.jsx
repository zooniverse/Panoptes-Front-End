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
      readMore: false
    };
  }

  toggleReadMore() {
    this.setState({ readMore: !this.state.readMore });
  }

  handleCategoryChange(category) {
    this.props.onChangeQuery({ category });
  }

  calculateClasses(category) {
    const list = classnames(
      'standard-button',
      'organization-page__category-button',
      { 'organization-page__category-button--active':
        (category === this.props.category) || (!this.props.category && (category === 'All')) }
    );
    return list;
  }

  render() {
    const researcherAvatarSrc = this.props.quoteObject.researcherAvatar || '/assets/simple-avatar.png';

    const [aboutPage] = this.props.organizationPages.filter(page => page.url_key === 'about');
    const aboutContentClass = classnames(
      'organization-details__about-content',
      { 'organization-details__about-content--expanded': this.state.readMore });

    let rearrangedLinks = [];
    if (this.props.organization.urls) {
      rearrangedLinks = this.props.organization.urls.sort((a, b) => {
        if (a.path && !b.path) {
          return 1;
        }
        return 0;
      });
    }

    return (
      <div className="organization-page">
        <Helmet title={this.props.organization.display_name} />
        <section
          className="organization-hero"
          style={{ backgroundImage: `url(${this.props.organizationBackground.src})` }}
        >
          <div className="organization-hero__background-gradient">
            {this.props.organization.announcement &&
              <Markdown tag="div" className="informational project-announcement-banner">
                {this.props.organization.announcement}
              </Markdown>}
            <div className="organization-hero__container">
              {this.props.organizationAvatar.src ?
                <Thumbnail
                  alt={`Organization icon for ${this.props.organization.display_name}`}
                  src={this.props.organizationAvatar.src}
                  className="organization-hero__avatar"
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                /> : <ZooniverseLogo className="organization-hero__avatar" width={AVATAR_SIZE} height={AVATAR_SIZE} />
              }
              <div className="organization-hero__wrapper">
                <h1 className="organization-hero__title">{this.props.organization.display_name}</h1>
                <p className="organization-hero__description">{this.props.organization.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="resources-container">
          {this.props.collaborator &&
            <label className="organization-page__toggle" htmlFor="collaborator view">
              <input
                id="collaborator view"
                onChange={() => this.props.toggleCollaboratorView()}
                type="checkbox"
                value={!this.props.collaboratorView}
              />
              <Translate content="organization.home.viewToggle" />
            </label>}
          {this.props.organization.categories && this.props.organization.categories.length > 0 &&
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
                All
              </label>
              {this.props.organization.categories.map(category =>
                <label
                  className={this.calculateClasses(category)}
                  htmlFor={category}
                  key={category}
                >
                  <input
                    className="organization-page__category-button--hidden"
                    id={category}
                    name="category"
                    onChange={this.handleCategoryChange.bind(this, category)}
                    type="radio"
                  />
                  {category}
                </label>)}
            </div>}
          <OrganizationProjectCards
            errorFetchingProjects={this.props.errorFetchingProjects}
            fetchingProjects={this.props.fetchingProjects}
            projects={this.props.organizationProjects}
            projectAvatars={this.props.projectAvatars}
          />
        </section>

        <section className="organization-details">
          <div className="organization-page__container">
            {this.props.quoteObject && this.props.quoteObject.quote &&
              <div className="organization-researcher-words">
                <Translate className="organization-details__heading" content="organization.home.researcher" />
                <div className="organization-researcher-words__container">
                  <img
                    className="organization-researcher-words__avatar"
                    role="presentation"
                    src={researcherAvatarSrc}
                  />
                  <span
                    className="organization-researcher-words__quote"
                  >
                    &quot;{this.props.quoteObject.quote}&quot;
                  </span>
                </div>
                <Link
                  className="organization-researcher-words__attribution"
                  to={this.props.quoteObject.slug}
                >
                  - {this.props.quoteObject.displayName}
                </Link>
              </div>}
            <div className="organization-details__content">
              <h4 className="organization-details__heading">
                {this.props.organization.display_name} <Translate content="organization.home.introduction" />
              </h4>
              {this.props.organization.introduction &&
                <Markdown project={this.props.organization}>{this.props.organization.introduction}</Markdown>}
            </div>
          </div>

          <OrganizationMetadata
            displayName={this.props.organization.display_name}
            projects={this.props.organizationProjects}
          />

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
            {this.props.organization.urls && this.props.organization.urls.length && (
              <ExternalLinksBlockContainer
                header={<Translate className="organization-details__heading" content="organization.home.links" component="h4" />}
                resource={this.props.organization}
              />
            )}
          </div>
        </section>
      </div>
    );
  }
}

OrganizationPage.defaultProps = {
  category: false,
  collaborator: false,
  collaboratorView: true,
  errorFetchingProjects: {},
  fetchingProjects: false,
  onChangeQuery: () => {},
  organization: {},
  organizationAvatar: {},
  organizationBackground: {},
  organizationPages: [],
  organizationProjects: [],
  projectAvatars: [],
  quoteObject: {},
  toggleCollaboratorView: () => {}
};

OrganizationPage.propTypes = {
  category: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string
  ]),
  collaborator: PropTypes.bool,
  collaboratorView: PropTypes.bool,
  errorFetchingProjects: PropTypes.shape({
    message: PropTypes.string
  }),
  fetchingProjects: PropTypes.bool,
  onChangeQuery: PropTypes.func,
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
