import React from 'react';
import HomePageSection from './generic-section';
import { Link } from 'react-router';
import ProjectIcon from '../../components/project-icon';
import apiClient from 'panoptes-client/lib/api-client';

const RecentProjectsSection = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      projects: [],
      avatars: {},
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.projects !== nextProps.projects) {
      this.setState({
        projects: nextProps.projects,
      });
    }
  },

  render() {
    return (
      <HomePageSection
        title="Recent projects"
        loading={this.state.loading}
        error={this.state.error}
        onClose={this.props.onClose}
      >
        {(this.props.projects === 0)
        ? <div className="home-page-section__header-label">
            <p> You have no recent projects. </p>
          </div>
        : <div className="project-card-list">
          {this.props.projects.map((project) => {
            return (
              <span key={project.id}>
                <ProjectIcon project={project} badge={project.classifications} />
                &ensp;
              </span>
            );
          })}
        </div>}
      </HomePageSection>
    );
  },
});

export default RecentProjectsSection;
