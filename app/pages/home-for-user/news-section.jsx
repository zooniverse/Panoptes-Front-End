import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';
import Publications from '../about/publications-page';

import style from './news-section.styl';
void style;

const NewsSection = React.createClass({

  getDefaultProps() {
    return {
      newDatasets: [],
    };
  },

  componentDidMount() {
    this.fetchProjects();
    this.recentPublications();
  },

  getInitialState() {
    return {
      avatars: {},
      projects: [],
      publications: [],
    };
  },

  recentPublications() {
    const articles = []
    for (var category in Publications.articles()) {
      Publications.articles()[category].map((project) =>{
        articles.push(...project.publications)
      });
    };
    const newestPublications = articles.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
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
    })
  },

  renderPublication(article) {
    return <div>
      <h5 className="pullout-timestamp">{article.date}</h5>
      <p className="news-section-content">
        <a href={article.href} target="_blank">
          {article.citation}
          <i className="fa fa-long-arrow-right"></i>
        </a>
      </p>
    </div>
  },

  renderNewDatasets(data) {
    const link = window.location.origin + "/projects/" + data.href
    return <div>
      <a href={link} target="_blank">
        <h5 className="news-section-title">{data.project} </h5>
        <h5> has been updated! </h5>
        <p className="pullout-timestamp">{data.timestamp}</p>
      </a>
    </div>
  },

  render() {
    return (
      <div className='news-pullout-main'>
        <div className='pullout-scroll-contain'>
          <h2> Zooniverse News </h2>

          <div className='news-pullout-section'>
            <h4> Recent Publications </h4>
            {this.state.publications.map((article) => {
              return this.renderPublication(article);
            })}
          </div>

          <div className='news-pullout-section'>
          <h4> Newest Project </h4>
          {this.state.projects.map((project) => {
            const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
            return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} />;
          })}
          </div>

          <div className='news-pullout-section'>
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
