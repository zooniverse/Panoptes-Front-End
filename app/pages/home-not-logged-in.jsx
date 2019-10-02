import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import statsClient from 'panoptes-client/lib/stats-client';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import apiClient from 'panoptes-client/lib/api-client';
import LoginDialog from '../partials/login-dialog';
import alert from '../lib/alert';
import FeaturedProject from './home-common/featured-project';
import HomePageSocial from './home-common/social';
import HomePageDiscover from './home-not-logged-in/discover';
import HomePageResearch from './home-not-logged-in/research';
import HomePagePromoted from './home-not-logged-in/promoted';
import PROMOTED_PROJECTS from '../lib/promoted-projects';

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
      featuredProject: null,
      promotedProjects: [],
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
    this.getPromotedProjects();
  }

  componentWillUnmount() {
    removeEventListener('resize', this.handleResize);
  }

  getFeaturedProject() {
    const query = { featured: true, launch_approved: true, cards: true };
    return apiClient.type('projects').get(query)
      .then(([featuredProject]) => {
        this.setState({ featuredProject });
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
    let count = 0;
    statsClient.query({
      period: 'year',
      type: 'classification'
    })
    .then((data) => {
      data.map((statObject) => {
        count += statObject.doc_count;
      });
      this.setState({ count }); // number will only appear on production
    });
  }

  getPromotedProjects() {
    apiClient.type('projects').get({ id: Object.keys(PROMOTED_PROJECTS), cards: true })
    .then((promotedProjects) => {
      promotedProjects.map((project) => {
        const promotedProject = PROMOTED_PROJECTS[project.id];
        project.image = promotedProject.image;
        project.title = promotedProject.title;
        return project;
      });
      this.setState({ promotedProjects });
    })
    .catch((error) => {
      console.warn(error);
    });
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
            <img role="presentation" className="home-mobile-video-image" src="./assets/home-video.jpg" />
            <video className="home-video" autoPlay={true} loop={true}>
              <source type="video/ogg" src="./assets/home-video.ogv" />
              <source type="video/webm" src="./assets/home-video.webm" />
              <source type="video/mp4" src="./assets/home-video.mp4" />
            </video>

            <Translate className="main-kicker" component="h1" content="notLoggedInHomePage.welcome" />
            <Translate className="main-headline" component="h2" content="notLoggedInHomePage.powered" />
            <Link to="/projects" className="primary-button">
              <Translate content="notLoggedInHomePage.projects" />
            </Link>
          </section>
        </div>

        <div className="flex-container">
          <FeaturedProject project={this.state.featuredProject} />
        </div>

        <div className="flex-container">
          <HomePageDiscover showDialog={this.showDialog} />
        </div>

        <div className="flex-container">
          <HomePagePromoted promotedProjects={this.state.promotedProjects} />
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
