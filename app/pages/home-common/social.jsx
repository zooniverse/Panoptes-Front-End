import React from 'react';
import Translate from 'react-translate-component';
import { Link } from 'react-router';
import classNames from 'classnames';
import counterpart from 'counterpart';
import moment from 'moment';
import ProjectCard from '../../partials/project-card';
import { getRecentProjects, getBlogPosts, getNewestProject } from '../../lib/get-social-data';
import striptags from 'striptags';

counterpart.registerTranslations('en', {
  socialHomePage: {
    community: 'The Zooniverse Community',
    daily: 'The Daily Zooniverse',
    news: 'News',
    latestProject: 'Latest Project',
    recentProjects: 'Project Updates',
    recentPublications: 'Publications',
    recentPublicationsBlurb: 'The contributions of Zooniverse volunteers produce real research. Our projects have led to hundreds of peer-reviewed publications across a wide range of disciplines.',
  }
});

export default class HomePageSocial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogPosts: [],
      newestProject: {},
      recentProjects: []
    };
  }

  componentDidMount() {
    this.getSocial();
  }

  async getSocial() {
    const newestProject = await getNewestProject();
    this.setState({ newestProject });
    const recentProjects = await getRecentProjects();
    this.setState({ recentProjects });
    const blogPosts = await getBlogPosts(blogPosts);
    this.setState({ blogPosts });
  }

  renderUpdatedProject(project) {
    const link = `/projects/${project.slug}`;
    const timestamp = moment(new Date(project.updated_at)).fromNow();
    return (
      <div key={project.id}>
        <h4 className="timestamp-label">{timestamp}</h4>
        <h5 className="tertiary-headline">{project.display_name} </h5>
        <a className="home-social__italic-link" href={link}> View Project </a>
        <hr />
      </div>
    );
  }

  renderBlogPost(post, i) {
    const background = {};
    background.backgroundImage = `url(${post.image})`;
    if (!post.image) { background.display = 'none'; }
    const classes = classNames({
      'home-social__blog-section': true,
      'home-social__blog-section--white': i === 0,
      'home-social__blog-section--gray': i !== 0
    });
    const timestamp = moment(new Date(post.created_at)).fromNow();
    return (
      <div key={i} className={classes}>
        {i !== 0 && (<hr />)}
        <h4 className="timestamp-label">{timestamp}</h4>
        <h5 className="tertiary-headline">{post.title} </h5>
        <div className="home-social__blog-post">
          <div style={background}></div>
          <div>
            <span className="regular-body">{striptags(post.excerpt)}</span>
            <br />
            <div>
              <a className="home-social__italic-link" href={post.link}> Read More... </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { blogPosts, newestProject, recentProjects } = this.state;

    return (
      <section className="home-social">
        <h2 className="secondary-kicker">Discover, teach, learn</h2>
        <Translate className="secondary-headline" content="socialHomePage.community" />

        <div className="home-social__icons">
          <span>
            <a href="https://twitter.com/the_zooniverse" aria-label="Visit Zooniverse Twitter" rel="noopener noreferrer" target="_blank">
              <i className="fa fa-twitter" />
            </a>
            <a href="https://www.facebook.com/therealzooniverse" aria-label="Visit Zooniverse Facebook" rel="noopener noreferrer" target="_blank">
              <i className="fa fa-facebook" />
            </a>
          </span>
        </div>

        <div className="home-social__content">
          <div className="home-social__news">
            <Translate className="tertiary-headline__headline" component="h2" content="socialHomePage.news" />
            <Translate className="tertiary-kicker" component="h3" content="socialHomePage.latestProject" />
            <ProjectCard
              className="home-page-not-logged-in__project-card"
              landingPage={true}
              project={newestProject}
            />
            <hr />

            <Translate className="tertiary-kicker" component="h3" content="socialHomePage.recentProjects" />

            {recentProjects.map(project => this.renderUpdatedProject(project))}

            <Translate className="tertiary-kicker" component="h3" content="socialHomePage.recentPublications" />
            <Translate className="regular-body" component="span" content="socialHomePage.recentPublicationsBlurb" />
            <br/>
            <a href="/about/publications" className="primary-button primary-button--light">See All Publications</a>
          </div>

          <div className="home-social__content--vertical-line"></div>

          <div className="home-social__daily">
            <Translate className="tertiary-headline__headline" component="h2" content="socialHomePage.daily" />
            {blogPosts.map((post, i) => {
              return this.renderBlogPost(post, i);
            })}
            <hr />
            <a href="http://blog.zooniverse.org" className="primary-button primary-button--light">See All Posts</a>
          </div>
        </div>
      </section>
    );
  }
}
