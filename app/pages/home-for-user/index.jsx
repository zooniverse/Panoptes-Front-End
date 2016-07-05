import React from 'react';
import BlurredImage from './blurred-image';
import CircleRibbon from './circle-ribbon';
import RecentProjectsSection from './recent-projects';
import RecentCollectionsSection from './recent-collections';
import RecentMessagesSection from './recent-messages';
import MyBuildsSection from './my-builds';

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
      openSection: null,
    };
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

        <div className="home-page-for-user__content" style={{ position: 'relative', zIndex: 1 }}>
          <CircleRibbon />
          <div className="home-page-for-user__welcome">Hello, {this.props.user.display_name}</div>
          {OpenSectionComponent === undefined ? (
            this.renderMenu()
          ) : (
            <OpenSectionComponent user={this.props.user} onClose={this.deselectSection} />
          )}
        </div>
      </div>
    );
  },
});

export default HomePageForUser;
