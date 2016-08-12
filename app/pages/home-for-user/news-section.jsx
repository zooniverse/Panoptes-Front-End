import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';
import Publications from '../about/publications-page';

import style from './news-section.styl';
void style;

const NewsSection = React.createClass({

  componentDidMount() {
    this.fetchProjects();
  },

  getInitialState() {
    return {
      avatars: {},
      projects: [],
      publications: [],
    };
  },

  componentWillReceiveProps() {
    this.recentPublications()
  },

  recentPublications() {
    const userProjects = [];
    const newsPublications = [];

    userProjects.push({name: 'Solar Stormwatch', slug: 'zooniverse/solar-stormwatch'}),
    this.props.projects.map((project) =>{
      userProjects.push({name:project.name, slug: project.slug});
    });

    for (var category in Publications.articles()) {
      Publications.articles()[category].map((project) =>{
        userProjects.map((userProj) =>{
          if (userProj.slug === project['slug']){
            newsPublications.push({name: userProj.name, publication: project.publications[0]});
          }
        })
      });
    };

    if (newsPublications.length < 2)
      newsPublications.push({name: 'Meta Data', publication: Publications.articles().meta[0].publications[0]});
    return this.setState({
      publications: newsPublications,
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
      <h5>{article.name}</h5>
      <p>{article.publication.citation}</p>
    </div>
  },

  render() {
    return (
      <div className='news-pullout-main'>
        <h2> Zooniverse News </h2>

        <div className='news-pullout-section'>
          <h3> Recent Publications </h3>
          {this.state.publications.map((article) => {
            return this.renderPublication(article);
          })}
        </div>

        <div className='news-pullout-section'>
          <h3> New Datasets </h3>
        </div>

        <div className='news-pullout-section'>
          <h3> Newest Project </h3>
          {this.state.projects.map((project) => {
            const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
            return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} />;
          })}
        </div>
      </div>
    );
  },
});

export default NewsSection;
