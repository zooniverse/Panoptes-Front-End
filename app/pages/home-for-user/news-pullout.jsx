import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import ProjectCard from '../../partials/project-card';
import Publications from '../../lib/publications';

import style from './news-pullout.styl';
void style;

const NewsSection = React.createClass({

  propTypes: {
    newDatasets: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      newDatasets: [],
    };
  },

  getInitialState() {
    return {
      avatars: {},
      projects: [],
      publications: [],
    };
  },

  componentDidMount() {
    this.fetchProjects();
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

  fetchProjects() {
    apiClient.type('projects').get({
      sort: '-launch_date',
      launch_approved: true,
      page_size: 1,
      include: ['avatar'],
    })
    .then((projects) => {
      this.setState({
        projects,
      });

      return Promise.all(projects.map((project) => {
        return project.get('avatar')
        .catch(() => {
          return null;
        })
        .then((avatar) => {
          this.state.avatars[project.id] = avatar;
          this.forceUpdate();
        });
      }));
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

  renderNewDatasets(data) {
    const link = window.location.origin + '/projects/' + data.href;
    return (<div key={Math.random()}>
      <a href={link} target="_blank">
        <h5 className="home-page-news-pullout news-section__title">{data.project} </h5>
        <h5> has been updated! </h5>
        <p className="home-page-news-pullout news-section__timestamp">{data.timestamp}</p>
      </a>
    </div>);
  },

  render() {
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
            {this.state.projects.map((project) => {
              const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
              return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} />;
            })}
          </div>

          <div className="home-page-news-pullout news-section">
            <h4> New Datasets </h4>
            {this.props.newDatasets.map((data) => {
              return this.renderNewDatasets(data);
            })}
          </div>
        </div>
      </div>
    );
  },
});

export default NewsSection;
