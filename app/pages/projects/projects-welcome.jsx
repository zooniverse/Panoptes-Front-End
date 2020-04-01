import counterpart from 'counterpart';
import { Markdown } from 'markdownz';
import apiClient from 'panoptes-client/lib/api-client';
import React, { Component } from 'react';
import Translate from 'react-translate-component';
import FeaturedProjectEditor from './featured-project-editor';
import ProjectCard from '../../partials/project-card';

class ProjectsWelcome extends Component {
  constructor() {
    super();
    this.state = {
      featuredProjects: []
    };
  }

  componentDidMount() {
    this.getFeaturedProjects();
  }

  getFeaturedProjects() {
    const query = { featured: true, cards: true };
    return apiClient.type('projects').get(query)
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
        <div className="project-card-list">
          {this.state.featuredProjects.map(project =>
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
