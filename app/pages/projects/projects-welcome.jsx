import counterpart from 'counterpart';
import { Markdown } from 'markdownz';
import apiClient from 'panoptes-client/lib/api-client';
import React, { Component } from 'react';
import Translate from 'react-translate-component';
import ProjectCardList from './project-card-list';

class ProjectsWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredProjects: []
    };
  }

  componentDidMount() {
    this.getFeaturedProjects();
  }

  getFeaturedProjects() {
    const query = { featured: true, launch_approved: true, cards: true };
    return apiClient.type('projects').get(query)
    // TODO: remove this hack once the featured projects API is fixed.
      .then(([project]) => [project, project, project, project])
      .then((featuredProjects) => {
        this.setState({ featuredProjects });
      });
  }
  render() {
    return (
      <div className="resources-container welcome-banner">
        <Translate content="projects.welcome.heading" component="h2" />
        <Translate content="projects.welcome.thanks" component="p" />
        <Markdown>{counterpart('projects.welcome.talk')}</Markdown>
        <ProjectCardList projects={this.state.featuredProjects} />
        <p><Translate content="projects.welcome.scrollDown" component="em" /></p>
      </div>
    );
  }
}

export default ProjectsWelcome;
