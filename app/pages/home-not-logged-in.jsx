import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import statsClient from 'panoptes-client/lib/eras-client';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import apiClient from 'panoptes-client/lib/api-client';
import LoginDialog from '../partials/login-dialog';
import alert from '../lib/alert';
import FeaturedProjects from './home-common/featured-projects';
import HomePageSocial from './home-common/social';
import HomePageDiscover from './home-not-logged-in/discover';
import HomePageResearch from './home-not-logged-in/research';

counterpart.registerTranslations('en', {
  notLoggedInHomePage: {
    projects: 'See All Projects',
    powered: 'People-powered research',
    welcome: 'welcome to the zooniverse'
  }
});

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.resizeTimeout = NaN;
    this.state = {
      count: 0,
      featuredProjects: [],
      screenWidth: 0,
      volunteerCount: 0
    };

    this.showDialog = this.showDialog.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getClassificationCounts();
    this.getFeaturedProject();
    this.getVolunteerCount();
  }

  componentWillUnmount() {
    removeEventListener('resize', this.handleResize);
  }

  getFeaturedProject() {
    const query = { featured: true, launch_approved: true, cards: true };
    return apiClient.type('projects').get(query)
      .then((featuredProjects) => {
        this.setState({ featuredProjects });
      });
  }

  getVolunteerCount() {
    apiClient.type('users').get({ page_size: 1 })
    .then(([user]) => {
      const meta = user.getMeta();
      this.setState({ volunteerCount: meta.count });
    });
  }

  getClassificationCounts() {
    statsClient.query({
      type: 'classifications'
    }).then(data => {
      let count = data.total_count
      this.setState({ count });
    }).catch((err) => {
      console.error('COULD NOT RETRIEVE ERAS TOTAL CLASSIFICATION COUNT', err)
    })
  }

  showDialog(event) {
    const which = event.currentTarget.value;
    alert(resolve =>
      <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />
    );
  }

  handleResize() {
    if (!isNaN(this.resizeTimeout)) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.setState({
        screenWidth: innerWidth
      }, () => {
        this.resizeTimeout = NaN;
      });
    }, 100);
  }

  render() {
    return (
      <div className="on-home-page home-page-not-logged-in">
        <div className="flex-container">
          <section className="home-intro">
            <img role="presentation" className="home-mobile-video-image" src="https://static.zooniverse.org/pfe-assets/home-video.jpg" />
            <video className="home-video" autoPlay={true} loop={true}>
              <source type="video/ogg" src="https://static.zooniverse.org/pfe-assets/home-video.ogv" />
              <source type="video/webm" src="https://static.zooniverse.org/pfe-assets/home-video.webm" />
              <source type="video/mp4" src="https://static.zooniverse.org/pfe-assets/home-video.mp4" />
            </video>

            <Translate className="main-kicker" component="h1" content="notLoggedInHomePage.welcome" />
            <Translate className="main-headline" component="h2" content="notLoggedInHomePage.powered" />
            <Link to="/projects" className="primary-button">
              <Translate content="notLoggedInHomePage.projects" />
            </Link>
          </section>
        </div>

        <div className="flex-container">
          <FeaturedProjects projects={this.state.featuredProjects} />
        </div>

        <div className="flex-container">
          <HomePageDiscover showDialog={this.showDialog} />
        </div>

        <div className="flex-container">
          <HomePageResearch
            count={this.state.count}
            screenWidth={this.state.screenWidth}
            showDialog={this.showDialog}
            volunteerCount={this.state.volunteerCount}
          />
        </div>

        <div className="flex-container">
          <HomePageSocial />
        </div>
      </div>
    );
  }
}

HomePage.contextTypes = {
  geordi: PropTypes.object
};
