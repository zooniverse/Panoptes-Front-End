import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import BlurredImage from './blurred-image';
import CircleRibbon from './circle-ribbon';
import RecentProjectsSection from './recent-projects';
import RecentCollectionsSection from './recent-collections';
import RecentMessagesSection from './recent-messages';
import MyBuildsSection from './my-builds';
import HomePageSocial from '../home-common/social';
import getColorFromString from '../../lib/get-color-from-string';
import mediaActions from '../lab/actions/media';
import FeaturedProject from '../home-common/featured-project';

const SECTIONS = {
  projects: RecentProjectsSection,
  collections: RecentCollectionsSection,
  messages: RecentMessagesSection,
  builds: MyBuildsSection
};

export default class HomePageForUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundSrc: '',
      featuredProject: null,
      totalClassifications: 0,
      ribbonData: [],
      loading: false,
      error: null,
      pendingMedia: [],
      selectedProjectID: null,
      openSection: null,
      OpenSectionComponent: null
    };
    this.getRibbonData = this.getRibbonData.bind(this);
    this.updateBackground = this.updateBackground.bind(this);
    this.createLinkedResource = this.props.actions.createLinkedResource.bind(this);
    this.uploadMedia = this.props.actions.uploadMedia.bind(this);
    this.deselectSection = this.deselectSection.bind(this);
  }

  componentDidMount() {
    this.fetchRibbonData(this.props.user);
    this.getFeaturedProject();
    this.handleHashChange();
  }

  componentWillReceiveProps(nextProps) {
    this.handleHashChange();
    if (nextProps.user !== this.props.user) {
      this.fetchRibbonData(nextProps.user);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if( this.state.OpenSectionComponent !== prevState.OpenSectionComponent) {
      if (this.openSection) {
        this.openSection.scrollIntoView();
      }
    }
  }

  handleHashChange() {
    const OpenSectionComponent = SECTIONS[window.location.hash.slice(1)];
    this.setState({ OpenSectionComponent });
  }

  getFeaturedProject() {
    const query = { featured: true, launch_approved: true, cards: true };
    return apiClient.type('projects').get(query)
      .then(([featuredProject]) => {
        this.setState({ featuredProject });
      });
  }

  fetchRibbonData(user) {
    if (!user) {
      return;
    }

    this.setState({
      loading: true,
      error: null
    });

    user.get('profile_header')
    .catch(() => {
      return [];
    })
    .then((profileHeaders) => {
      const profileHeader = [].concat(profileHeaders)[0];
      if (profileHeader) {
        this.setState({
          backgroundSrc: profileHeader.src
        });
      }
    });

    this.getRibbonData(user)
    .catch((error) => {
      this.setState({ error });
    })
    .then(() => {
      this.setState({
        loading: false
      });
    });
  }

  getRibbonData(user, _page = 1) {
    const getRibbonData = this.getRibbonData;
    return user.get('project_preferences', {
      sort: '-updated_at',
      page: _page
    })
    .then((projectPreferences) => {
      if (projectPreferences.length === 0) {
        return projectPreferences;
      } else {
        let activePreferences = projectPreferences.filter((preference) => { return preference.activity_count > 0; });
        activePreferences = activePreferences.map((preference, i) => {
          preference.sort_order = i;
          return preference;
        });
        this.getProjectsForPreferences(activePreferences)
          .then((projects) => {
            return projects
            .sort((a, b) => {
              return a.sort_order - b.sort_order;
            })
            .filter(Boolean)
            .map((project, i) => {
              return {
                avatar_src: projects[i].avatar_src,
                id: projects[i].id,
                slug: projects[i].slug,
                display_name: projects[i].display_name,
                description: projects[i].description,
                color: getColorFromString(projects[i].slug),
                classifications: projects[i].activity_count,
                updated_at: projects[i].updated_at,
                redirect: projects[i].redirect
              };
            });
          })
          .then((projects) => {
            this.setState((prevState) => {
              const ribbonData = prevState.ribbonData.concat(projects);
              const totalClassifications = ribbonData.reduce((total, project) => {
                return total + project.classifications;
              }, 0);
              return { ribbonData, totalClassifications };
            });
          });
        const meta = projectPreferences[0].getMeta();
        if (meta.page !== meta.page_count) {
          getRibbonData(user, meta.page + 1);
        }
      }
    });
  }

  getProjectsForPreferences(preferences) {
    const projectIDs = preferences.map((projectPreference) => {
      return projectPreference.links.project;
    });
    return apiClient
    .type('projects')
    .get({ id: projectIDs, cards: true, page_size: preferences.length })
    .catch((error) => {
      console.log('Something went wrong. Error: ', error);
    })
    .then((projects) => {
      const classifications = preferences.reduce((counts, projectPreference) => {
        counts[projectPreference.links.project] = projectPreference.activity_count;
        return counts;
      }, {});
      const sortOrders = preferences.reduce((orders, projectPreference) => {
        orders[projectPreference.links.project] = projectPreference.sort_order;
        return orders;
      }, {});
      return projects.map((project) => {
        project.activity_count = classifications[project.id];
        project.sort_order = sortOrders[project.id];
        return project;
      });
    });
  }

  deselectSection() {
    this.node.scrollIntoView();
  }

  findProjectLink(project) {
    return `/projects/${project.slug}`;
  }

  renderMenu(openComponent) {
    if ((openComponent) && (screen.width < 700)) {
      return;
    }
    return (
      <div className="home-page-for-user__menu" onClick={this.handleHashChange.bind(this)}>
        <div className="home-page-for-user__menu-column">
          <Link to="#projects" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-history fa-fw" />{' '}
              My recent projects
            </span>
          </Link>
          <Link to="#collections" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-th-large fa-fw" />{' '}
              My collections
            </span>
          </Link>
        </div>
        <div className="home-page-for-user__menu-column">
          <Link to="#messages" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-envelope fa-fw" />{' '}
              Messages
            </span>
          </Link>
          <Link to="#builds" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw" />{' '}
              My builds
            </span>
          </Link>
        </div>
      </div>
    );
  }

  updateBackground(event) {
    const file = event.target.files[0];
    const location = this.props.user._getURL('profile_header')
    return this.createLinkedResource(file, location)
      .then(this.uploadMedia.bind(this, file))
      .then((media) => {
        this.setState({ backgroundSrc: media.src });
      });
  }

  render() {
    if (!this.props.user) return null;
    const { featuredProject, OpenSectionComponent } = this.state;
    return (
      <div className="on-home-page" ref={(node) => { this.node = node; }}>
        <div className="home-page-for-user">
          <BlurredImage className="home-page-for-user__background" src={this.state.backgroundSrc} blur="0.5em" position="50% 33%" />

          {!!this.state.error && (
            <div>{this.state.error.toString()}</div>
          )}

          {window.innerWidth > 700 && (
            <div className="home-page-for-user__change-background">
              <input id="updateBackground" type="file" accept="image/*" onChange={this.updateBackground} />
              <label htmlFor="updateBackground">
                <span>
                  Update Background
                </span>
              </label>
            </div>
          )}

          <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
            <CircleRibbon user={this.props.user} loading={this.state.loading} data={this.state.ribbonData} hrefTemplate={this.findProjectLink} />

            <div className="home-page-for-user__welcome">
              Hello {this.props.user.display_name},<br />
              you have made {this.state.totalClassifications} classifications to date.
            </div>

            {this.renderMenu(OpenSectionComponent)}

            {OpenSectionComponent && (
              <OpenSectionComponent
                ref={ (component) => this.openSection = ReactDOM.findDOMNode(component) }
                projects={this.state.ribbonData}
                onClose={this.deselectSection}
              />
            )}

            {!OpenSectionComponent &&
              <i className="home-page-for-user__down-arrow fa fa-arrow-down" aria-hidden="true" />}

          </div>
        </div>

        <FeaturedProject project={featuredProject} />

        <HomePageSocial />

      </div>
    );
  }
}

HomePageForUser.propTypes = {
  actions: PropTypes.shape({
    createLinkedResource: PropTypes.func,
    uploadMedia: PropTypes.func
  }),
  user: PropTypes.shape({
    display_name: PropTypes.string
  }),
  location: PropTypes.shape({
    hash: PropTypes.string
  })
};

HomePageForUser.defaultProps = {
  actions: mediaActions,
  project: {},
  metadata: {},
  user: {}
};
