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
    this.fetchRibbonData(this.props.user);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.fetchRibbonData(nextProps.user);
    }
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

  selectProject(projectID) {
    this.setState({
      selectedProjectID: projectID,
    });
  },

  deselectProject() {
    this.setState({
      selectedProjectID: null,
    });
  },

  selectSection(event) {
    this.setState({
      openSection: event.currentTarget.value,
    });
  },

  deselectSection() {
    this.setState({
      openSection: null,
    });
  },

  renderMenu() {
    return (
      <div className="home-page-for-user__menu">
        <div className="home-page-for-user__menu-column">
          <button type="button" value="projects" className="secret-button home-page-for-user__menu-button" onClick={this.selectSection}>
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My recent projects
            </span>
          </button>
          <button type="button" value="collections" className="secret-button home-page-for-user__menu-button" onClick={this.selectSection}>
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My collections
            </span>
          </button>
        </div>
        <div className="home-page-for-user__menu-column">
          <button type="button" value="messages" className="secret-button home-page-for-user__menu-button" onClick={this.selectSection}>
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              Messages
            </span>
          </button>
          <button type="button" value="builds" className="secret-button home-page-for-user__menu-button" onClick={this.selectSection}>
            <span className="home-page-for-user__menu-label">
              <i className="fa fa-cog fa-fw"></i>
              My builds
            </span>
          </button>
        </div>
      </div>
    );
  },

  render() {
    if (!this.props.user) return null;

    const OpenSectionComponent = SECTIONS[this.state.openSection];

    return (
      <div className="home-page-for-user">
        <BlurredImage className="home-page-for-user__background" src="//lorempixel.com/500/500/animals/2" blur="0.5em" position="50% 33%" />

        {!!this.state.error && (
          <div>{this.state.error.toString()}</div>
        )}

        {this.state.selectedProjectID === null ? (
          <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
            <CircleRibbon data={this.state.ribbonData} onClick={this.selectProject} />
            <div className="home-page-for-user__welcome">Hello, {this.props.user.display_name}</div>

            {OpenSectionComponent === undefined ? (
              this.renderMenu()
            ) : (
              <OpenSectionComponent user={this.props.user} onClose={this.deselectSection} />
            )}
          </div>
        ) : (
          <ProjectStats projectID={this.state.selectedProjectID} onClose={this.deselectProject} />
        )}
      </div>
    );
  },
});

export default HomePageForUser;
