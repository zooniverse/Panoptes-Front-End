import React from 'react';
import { Link } from 'react-router';
import statsClient from 'panoptes-client/lib/stats-client';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import apiClient from 'panoptes-client/lib/api-client';
import LoginDialog from '../partials/login-dialog';
import alert from '../lib/alert';
import Publications from '../lib/publications';
import FeaturedProject from './home-common/featured-project';
import HomePageSocial from './home-common/social';
import HomePageDiscover from './home-not-logged-in/discover';
import HomePageResearch from './home-not-logged-in/research';
import HomePagePromoted from './home-not-logged-in/promoted';
import FEATURED_PROJECTS from '../lib/featured-projects';

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
      count: 55000000,
      promotedProjects: [],
      screenWidth: 0,
      volunteerCount: 1500000
    };

    this.showDialog = this.showDialog.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    document.documentElement.classList.add('on-home-page-not-logged-in');
    addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getClassificationCounts();
    this.getVolunteerCount();
    this.getPromotedProjects();
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-home-page-not-logged-in');
    removeEventListener('resize', this.handleResize);
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

  getNewestProject() {
    apiClient.type('projects').get({ page_size: 1, sort: '-launch_date' })
    .then(([newestProject]) => {
      this.setState({ newestProject });
    });
  }

  getNewestPublication() {
    const articles = [];
    Object.keys(Publications).forEach((category) => {
      Publications[category].map((project) => {
        return articles.push(...project.publications);
      });
    });
    const newestPublication = articles.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    }).shift();
    return this.setState({ newestPublication });
  }

  getUpdatedProjects() {
    const query = { launch_approved: true, page_size: 3, sort: '-updated_at' };
    apiClient.type('projects').get(query)
    .then((recentProjects) => {
      this.setState({ recentProjects });
    });
  }

  getBlogPosts() {
    const request = new XMLHttpRequest();
    request.open('GET', `${talkClient.root}/social`, true);
    request.onload = () => {
      const data = JSON.parse(request.responseText);
      this.setState({ blogPosts: data.posts });
    };
    request.send();
  }

  showDialog(event) {
    const which = event.currentTarget.value;
    alert(resolve =>
      <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />
    );
  }

  getPromotedProjects() {
    apiClient.type('projects').get({ id: Object.keys(FEATURED_PROJECTS), cards: true })
    .then((promotedProjects) => {
      promotedProjects.map((project) => {
        const featuredProject = FEATURED_PROJECTS[project.id];
        project.image = featuredProject.image;
        project.title = featuredProject.title;
        return project;
      });
      this.setState({ promotedProjects });
    })
    .catch((error) => {
      console.warn(error);
    });
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
          <FeaturedProject />
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
          <HomePageSocial
            blogPosts={this.state.blogPosts}
            newestProject={this.state.newestProject}
            newestPublication={this.state.newestPublication}
            recentProjects={this.state.recentProjects}
          />
        </div>
      </div>
    );
  }
}

HomePage.contextTypes = {
  geordi: React.PropTypes.object
};
