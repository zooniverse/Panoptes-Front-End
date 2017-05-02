import React from 'react';
import Translate from 'react-translate-component';
import { Link } from 'react-router';
import counterpart from 'counterpart';
import moment from 'moment';
import ProjectCard from '../../partials/project-card';

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

const HomePageSocial = ({ blogPosts, newestProject, newestPublication, recentProjects }) => {
  const renderUpdatedProject = (project) => {
    const link = `/projects/${project.slug}`;
    const timestamp = moment(new Date(project.updated_at)).fromNow();
    return (
      <div key={project.id}>
        <h6 className="timestamp-label">{timestamp}</h6>
        <h5 className="tertiary-headline">{project.display_name} </h5>
        <span className="regular-body"> has been updated! </span> <br />
        <a className="home-social__italic-link" href={link}> View Project </a>
        <hr />
      </div>
    );
  };

  const renderBlogPost = (post) => {
    const timestamp = moment(new Date(post.created_at)).fromNow();
    return (
      <div>
        <h6 className="timestamp-label">{timestamp}</h6>
        <h5 className="tertiary-headline">{post.title} </h5>
        <span className="regular-body">{post.excerpt}</span>
        <br />
        <a className="home-social__italic-link" href={post.link}> Read More... </a>
        <hr />
      </div>
    );
  };

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
            return renderUpdatedProject(project);
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
          {blogPosts.map((post) => {
            return renderBlogPost(post);
          })}
          <a href="http://blog.zooniverse.org" className="primary-button primary-button--light">See All Posts</a>
        </div>
      </div>
    </section>
  );
};

HomePageSocial.propTypes = {
  blogPosts: React.PropTypes.arrayOf(React.PropTypes.object),
  newestProject: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    introduction: React.PropTypes.string
  }),
  newestPublication: React.PropTypes.shape({
    citation: React.PropTypes.string,
    date: React.PropTypes.string,
    href: React.PropTypes.string
  }),
  recentProjects: React.PropTypes.arrayOf(React.PropTypes.object)
};

export default HomePageSocial;
