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

  renderNewDatasets(data) {
    const date = this.formatDate(new Date(data.date_updated));
    return <div>
      <h5>{data.project}</h5>
      <p className= "news-section-content">{data.dataSet}</p>
      <p className="pullout-dataset-timestamp">{date}</p>
    </div>
  },

  formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May",
    "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return months[month] + " " + day + ", " + year
  },

  render() {
    return (
      <div className='news-pullout-main'>
        <h2> Zooniverse News </h2>

        <div className='news-pullout-section'>
          <h4> Recent Publications </h4>
          {this.state.publications.map((article) => {
            return this.renderPublication(article);
          })}
        </div>

        <div className='news-pullout-section'>
          <h4> New Datasets </h4>
          {this.props.newDatasets.map((data) => {
            return this.renderNewDatasets(data);
          })}
        </div>

        <div className='news-pullout-section'>
          <h4> Newest Project </h4>
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
