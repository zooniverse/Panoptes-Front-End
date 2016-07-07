import React from 'react';
// import apiClient from 'panoptes-client/lib/api-client';
import BlurredImage from './blurred-image';
import getUserRibbonData from '../../lib/get-user-ribbon-data';
import CircleRibbon from './circle-ribbon';
import RecentProjectsSection from './recent-projects';
import RecentCollectionsSection from './recent-collections';
import RecentMessagesSection from './recent-messages';
import MyBuildsSection from './my-builds';
import ProjectStats from './project-stats';
import qs from 'qs';

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
  },

  getDefaultProps() {
    return {
      user: {},
    };
  },

  getInitialState() {
    return {
      ribbonData: [],
      loading: false,
      error: null,
      selectedProjectID: null,
      openSection: null,
    };
  },

  componentDidMount() {
    addEventListener('hashChange', this.handleHashChange);
    this.fetchRibbonData(this.props.user);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.fetchRibbonData(nextProps.user);
    }
  },

  componentWillUnmount() {
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

    getUserRibbonData(user)
    .then((ribbonData) => {
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

    const hashQuery = qs.parse(this.props.location.hash.slice(1));

    const OpenSectionComponent = SECTIONS[hashQuery.focus];

    return (
      <div className="home-page-for-user">
        <BlurredImage className="home-page-for-user__background" src="//lorempixel.com/500/500/animals/2" blur="0.5em" position="50% 33%" />

        {!!this.state.error && (
          <div>{this.state.error.toString()}</div>
        )}

        {!!hashQuery.project ? (
          <ProjectStats projectID={hashQuery.project} onClose={this.deselectProject} />
        ) : (
          <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
            <CircleRibbon data={this.state.ribbonData} />
            <div className="home-page-for-user__welcome">Hello, {this.props.user.display_name}</div>

            {OpenSectionComponent === undefined ? (
              this.renderMenu()
            ) : (
              <OpenSectionComponent user={this.props.user} onClose={this.deselectSection} />
            )}
          </div>
        )}
      </div>
    );
  },
});

export default HomePageForUser;
