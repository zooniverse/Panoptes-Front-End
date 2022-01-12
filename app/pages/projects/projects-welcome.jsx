import counterpart from 'counterpart';
import { Markdown } from 'markdownz';
import apiClient from 'panoptes-client/lib/api-client';
import React, { Component } from 'react';
import Translate from 'react-translate-component';
import FeaturedProjectEditor from './featured-project-editor';
import ProjectCard from '../../partials/project-card';

class ProjectsWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredProjects: [],
      recommendedProjects: [],
      user: null
    };
  }

  componentDidMount() {
    this.getFeaturedProjects();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      console.log('I have a user now :) setting it as state');
      console.log(nextProps.user);
      this.setState({ user: nextProps.user });
    }
  }

  componentDidUpdate(_prevProps, prevState) {
    const { user } = this.state;
    if (user !== prevState.user) {
      this.getRecommendedProjects();
    }
  }

  getFeaturedProjects() {
    const query = { featured: true, cards: true };
    return apiClient.type('projects').get(query)
      .then((featuredProjects) => {
        this.setState({ featuredProjects });
      });
  }

  getRecommendedProjects() {
    // TODO: query the recommender end point
    const { user } = this.state;
    if (user) {
      // only return 4 projects right now
      // alternatively fetch more but shuffle so they change on page refresh
      const recommenderUrl = `http://127.0.0.1:8000/recommend?user_id=${user.id}&page_size=4`;
      fetch(recommenderUrl)
        .then((response) => {
          console.log(response.statusText);
          if (!response.ok) {
            console.error('recommender service: ERROR');
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          // console.log('recommender service: Received data');

          // recommender system is built on production data so project ids won't match :(
          const projectIds = data.map(recommendation => recommendation.project_id);
          const query = { ids: projectIds.join(','), cards: true };
          return apiClient.type('projects').get(query)
            .then((recommendedProjects) => {
              this.setState({ recommendedProjects });
            });
        })
        .catch((err) => {
          console.error(`recommender service: No status data from ${err}`);
        });
    }
  }

  render() {
    const isLoggedIn = this.state.user;
    return (
      <div className="resources-container welcome-banner">
        <Translate content="projects.welcome.heading" component="h2" />
        <Translate content="projects.welcome.thanks" component="p" />
        <Markdown>{counterpart('projects.welcome.talk')}</Markdown>
        <div className="project-card-list">
          {this.state.featuredProjects.map(project =>
            <FeaturedProjectEditor key={project.id} project={project}>
              <ProjectCard project={project} />
            </FeaturedProjectEditor>
          )}
        </div>
        {isLoggedIn && <Translate content="projects.welcome.recommended" component="p" /> }
        <div className="project-card-list">
          {this.state.recommendedProjects.map(project =>
            <FeaturedProjectEditor key={project.id} project={project}>
              <ProjectCard project={project} />
            </FeaturedProjectEditor>
          )}
        </div>
        <p><Translate content="projects.welcome.scrollDown" component="em" /></p>
      </div>
    );
  }
}

export default ProjectsWelcome;
