import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';

const NewsSection = React.createClass({

  componentDidMount() {
    this.fetchProjects();
  },

  getInitialState() {
    return {
      projects: [],
      avatars: {},
    };
  },

  fetchProjects() {
    apiClient.type('projects').get({
      sort: '-launch_date',
      launch_approved: true,
      page_size: 3,
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

  render() {
    return (
      <div>
        <h1> Recently Launched Projects: </h1>
        {this.state.projects.map((project) => {
          const avatarSrc = !!this.state.avatars[project.id] ? this.state.avatars[project.id].src : null;
          return <ProjectCard key={project.id} project={project} imageSrc={avatarSrc} />;
        })}
      </div>
    );
  },
});

export default NewsSection;
