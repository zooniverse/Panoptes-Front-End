import React from 'react';
import BlurredImage from './blurred-image';
import Pullout from 'react-pullout';
import getUserRibbonData from '../../lib/get-user-ribbon-data';
import CircleRibbon from './circle-ribbon';
import RecentProjectsSection from './recent-projects';
import RecentCollectionsSection from './recent-collections';
import RecentMessagesSection from './recent-messages';
import MyBuildsSection from './my-builds';
import ProjectStats from './project-stats';
import qs from 'qs';
import HomePageSocial from '../home-not-logged-in/social';
import NewsSection from './news-section';
import moment from 'moment';

import style from './index.styl';
void style;

const SECTIONS = {
  projects: RecentProjectsSection,
  collections: RecentCollectionsSection,
  messages: RecentMessagesSection,
  builds: MyBuildsSection,
};

const HomePageForUser = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    location: React.PropTypes.object,
  },

  contextTypes: {
    setAppHeaderVariant: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      user: {},
    };
  },

  getInitialState() {
    return {
      backgroundSrc: '',
      avatarSrc: '',
      showNews: false,
      ribbonData: [],
      loading: false,
      error: null,
      selectedProjectID: null,
      openSection: null,
    };
  },

  componentDidMount() {
    this.context.setAppHeaderVariant('detached');
    addEventListener('hashChange', this.handleHashChange);
    this.fetchRibbonData(this.props.user);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.fetchRibbonData(nextProps.user);
    }
  },

  componentWillUnmount() {
    this.context.setAppHeaderVariant(null);
    removeEventListener('hashChange', this.handleHashChange);
  },

  handleHashChange() {
    this.forceUpdate();
  },

  fetchRibbonData(user) {
    if (!user) {
      return;
    }

    this.setState({
      loading: true,
      error: null,
    });

    user.get('profile_header')
    .catch(() => {
      return [];
    })
    .then((profileHeaders) => {
      const profileHeader = [].concat(profileHeaders)[0];
      if (!!profileHeader) {
        this.setState({
          backgroundSrc: profileHeader.src,
        });
      }
    });

    user.get('avatar')
    .catch(() => {
      return [];
    })
    .then((avatars) => {
      const avatar = [].concat(avatars)[0];
      if (!!avatar) {
        this.setState({
          avatarSrc: avatar.src,
        });
      }
    });

    getUserRibbonData(user)
    .then((ribbonData) => {
      this.recentSubjects(ribbonData);
      this.setState({
        ribbonData: ribbonData,
      });
    })
    .catch((error) => {
      this.setState({
        error: error,
      });
    })
    .then(() => {
      this.setState({
        loading: false,
      });
    });
  },

  recentSubjects(ribbonData) {
    this.setState({
      newData: this.fetchRecentSubjects(ribbonData),
    });
  },

  findProjectLink(project) {
    return `/projects/${project.slug}`;
  },

  fetchRecentSubjects(ribbonData) {
    const newestSubjectSets = [];
    ribbonData.map((project) => {
      if (!!project.recentSubjectSet) {
        newestSubjectSets.push(project);
      }
    });
    const recentSets = newestSubjectSets.sort((a, b) => {
      return new Date(b.recentSubjectSet.updated_at) - new Date(a.recentSubjectSet.updated_at);
    }).slice(0, 3);

    return recentSets.map((project) => {
      return {
        project: project.name,
        href: project.slug,
        timestamp: moment(new Date(project.recentSubjectSet.updated_at)).fromNow(),
      };
    });
  },

  toggleNews() {
    this.setState({
      showNews: !this.state.showNews,
    });
  },

  renderMenu() {
    return (
      <div className="home-page-for-user__menu">
        <div className="home-page-for-user__menu-column">
          <a href="#focus=projects" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My recent projects
            </span>
          </a>
          <a href="#focus=collections" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My collections
            </span>
          </a>
        </div>
        <div className="home-page-for-user__menu-column">
          <a href="#focus=messages" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              Messages
            </span>
          </a>
          <a href="#focus=builds" className="home-page-for-user__menu-button">
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My builds
            </span>
          </a>
        </div>
      </div>
    );
  },

  render() {
    if (!this.props.user) return null;

    let avatarSrc = this.state.avatarSrc;
    if (!avatarSrc) {
      avatarSrc = '/assets/simple-avatar.jpg';
    }

    const hashQuery = qs.parse(this.props.location.hash.slice(1));

    const OpenSectionComponent = SECTIONS[hashQuery.focus];

    return (
      <div>
        <div className="home-page-for-user">
          <BlurredImage className="home-page-for-user__background" src={this.state.backgroundSrc} blur="0.5em" position="50% 33%" />

          {!!this.state.error && (
            <div>{this.state.error.toString()}</div>
          )}

          {!!hashQuery.project ? (
            <ProjectStats projectID={hashQuery.project} onClose={this.deselectProject} />
          ) : (
            <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
              <CircleRibbon user={this.props.user} loading={this.state.loading} image={avatarSrc} data={this.state.ribbonData} hrefTemplate={this.findProjectLink} />

              <div className="home-page-for-user__welcome">Hello, {this.props.user.display_name}</div>

              {OpenSectionComponent === undefined ? (
                this.renderMenu()
              ) : (
                <OpenSectionComponent user={this.props.user} onClose={this.deselectSection} />
              )}
            </div>
          )}

          <Pullout className="home-page-news-pullout" side="right" open={this.state.showNews}>
            <button type="button" className="secret-button home-page-news-pullout__toggle-button" onClick={this.toggleNews}>
              <div className="home-page-news-pullout__toggle-label">
                <i className="fa fa-cog fa-fw"></i>
                <br />
                News
              </div>
            </button>

            <NewsSection newDatasets={this.state.newData} />

          </Pullout>
        </div>

        <div className="home-page-for-user on-home-page-logged-in">
          <HomePageSocial />
        </div>

      </div>
    );
  },
});

export default HomePageForUser;
