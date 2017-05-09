import React from 'react';
import Translate from 'react-translate-component';
import { Link } from 'react-router';
import counterpart from 'counterpart';
import moment from 'moment';
import ProjectCard from '../../partials/project-card';
import { getPublication, getRecentProjects, getBlogPosts, getNewestProject } from '../../lib/get-social-data';

counterpart.registerTranslations('en', {
  socialHomePage: {
    community: 'The Zooniverse Community',
    daily: 'The Daily Zooniverse',
    news: 'News',
    newestProject: 'Newest Project',
    recentProjects: 'Recent Project Updates',
    recentPublications: 'Recent Publications'
  }
});

export default class HomePageSocial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: [],
      newestProject: {},
      newestPublication: {},
      recentProjects: []
    };
  }

  componentDidMount() {
    this.getSocial();
  }

  getSocial() {
    getNewestProject().then((newestProject) => {
      this.setState({
        newestProject,
        newestPublication: getPublication()
      });
    });
    getRecentProjects().then((recentProjects) => {
      this.setState({ recentProjects });
    });
    getBlogPosts((blogPosts) => {
      this.setState({ blogPosts });
    });
  }

  renderUpdatedProject(project) {
    const link = `/projects/${project.slug}`;
    const timestamp = moment(new Date(project.updated_at)).fromNow();
    return (
      <div className="home-social__project-update" key={project.id}>
        <h6 className="timestamp-label">{timestamp}</h6>
        <h5 className="tertiary-headline">{project.display_name} </h5>
        <a className="home-social__italic-link" href={link}> View Project </a>
        <hr />
      </div>
    );
  }

  renderBlogPost(post, i) {
    const background = {};
    background.backgroundImage = `url(${post.image})`;
    const firstPost = i === 0 ? 'home-social__blog-post--white' : '';
    const timestamp = moment(new Date(post.created_at)).fromNow();
    return (
      <div key={i} className={firstPost}>
        <h6 className="timestamp-label">{timestamp}</h6>
        <h5 className="tertiary-headline">{post.title} </h5>
        <div className="home-social__blog-post">
          <div style={background}></div>
          <div>
            <span className="regular-body">{post.excerpt}</span>
            <br />
            <div>
              <a className="home-social__italic-link" href={post.link}> Read More... </a>
            </div>
          </div>
        </div>
        {!firstPost && (<hr />)}
      </div>
    );
  }

  render() {
    const blogPosts = this.state.blogPosts;
    const newestProject = this.state.newestProject;
    const newestPublication = this.state.newestPublication;
    const recentProjects = this.state.recentProjects;

    return (
      <section className="home-social">
        <h3 className="secondary-kicker">Discover, teach, learn</h3>
        <Translate className="secondary-headline" content="socialHomePage.community" />

        <div className="home-social__icons">
          <span>
            <a href="https://twitter.com/the_zooniverse" target="_blank">
              <i className="fa fa-twitter" />
            </a>
            <a href="https://www.facebook.com/therealzooniverse" target="_blank">
              <i className="fa fa-facebook" />
            </a>
            <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank">
              <i className="fa fa-google-plus" />{' '}
            </a>
          </span>
        </div>

        <div className="home-social__content">
          <div className="home-social__news">
            <Translate className="tertiary-headline__headline" content="socialHomePage.news" />
            <Translate className="tertiary-kicker" content="socialHomePage.newestProject" />
            <ProjectCard
              customCSS="home-page-not-logged-in__project-card"
              landingPage={true}
              project={newestProject}
            />
            <hr />

            <Translate className="tertiary-kicker" content="socialHomePage.recentProjects" />
            {recentProjects.map((project) => {
              return this.renderUpdatedProject(project);
            })}

            <Translate className="tertiary-kicker" content="socialHomePage.recentPublications" />
            <h5 className="timestamp-label">{newestPublication.date}</h5>
            <span className="regular-body">{newestPublication.citation}</span>
            <a className="home-social__italic-link" href={newestPublication.href}> Read More... </a>
            <hr />

            <Link to="/about/publications" className="primary-button primary-button--light">See All Publications</Link>
          </div>

          <div className="home-social__content--vertical-line"></div>

          <div className="home-social__daily">
            <Translate className="tertiary-headline__headline" content="socialHomePage.daily" />
            {blogPosts.map((post, i) => {
              return this.renderBlogPost(post, i);
            })}
            <a href="http://blog.zooniverse.org" className="primary-button primary-button--light">See All Posts</a>
          </div>
        </div>
      </section>
    );
  }
}
