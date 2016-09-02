import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ProjectCard from '../../partials/project-card';
import Publications from '../../lib/publications';
import moment from 'moment';

import style from './news-pullout.styl';
void style;

const NewsSection = React.createClass({

  propTypes: {
    updatedProjects: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      updatedProjects: [],
    };
  },

  getInitialState() {
    return {
      newestAvatar: {},
      newestProject: {},
      publications: [],
      projects: [],
    };
  },

  componentDidMount() {
    this.fetchNewestProject();
    this.recentPublications();
  },

  recentPublications() {
    const articles = [];
    Object.keys(Publications).forEach((category) => {
      Publications[category].map((project) => {
        return articles.push(...project.publications);
      });
    });
    const newestPublications = articles.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    }).splice(0, 3);
    return this.setState({
      publications: newestPublications,
    });
  },

  fetchNewestProject() {
    apiClient.type('projects').get({
      sort: '-launch_date',
      launch_approved: true,
      page_size: 1,
      include: ['avatar'],
    })
    .then(([project]) => {
      return new Promise(() => {
        return apiClient.type('avatars')
        .get(project.links.avatar.id)
        .catch(() => {
          return null;
        })
        .then((avatar) => {
          this.setState({
            newestAvatar: avatar,
            newestProject: project,
          });
        });
      });
    });
  },

  renderPublication(article) {
    return (<div key={Math.random()}>
      <h5 className="home-page-news-pullout news-section__timestamp">{article.date}</h5>
      <p className="home-page-news-pullout news-section__content">
        <a href={article.href} target="_blank">
          {article.citation}
          <i className="fa fa-long-arrow-right"></i>
        </a>
      </p>
    </div>);
  },

  renderUpdatedProjects(project) {
    const link = window.location.origin + '/projects/' + project.slug;
    const timestamp = moment(new Date(project.updated_at)).fromNow();
    return (<div key={project.id}>
      <a href={link} target="_blank">
        <h5 className="home-page-news-pullout news-section__title">{project.name} </h5>
        <h5> has been updated! </h5>
        <p className="home-page-news-pullout news-section__timestamp">{timestamp}</p>
      </a>
    </div>);
  },

  render() {
    const projLink = window.location.origin + '/projects/' + this.state.newestProject.slug || null
    const avatarSrc = this.state.newestAvatar.src || null

    return (
      <div className="home-page-news-pullout news-main">
        <div className="home-page-news-pullout news-container">
          <h2> Zooniverse News </h2>

          <div className="home-page-news-pullout news-section">
            <h4> Recent Publications </h4>
            {this.state.publications.map((article) => {
              return this.renderPublication(article);
            })}
          </div>

          <div className="home-page-news-pullout news-section">
            <h4> Newest Project </h4>
            <ProjectCard href={projLink} key={this.state.newestProject.id} project={this.state.newestProject} imageSrc={avatarSrc} />
          </div>

          <div className="home-page-news-pullout news-section">
            <h4> Updated Projects </h4>
            {this.props.updatedProjects.map((project) => {
              return this.renderUpdatedProjects(project);
            })}
          </div>
        </div>
      </div>
    );
  },
});

export default NewsSection;
