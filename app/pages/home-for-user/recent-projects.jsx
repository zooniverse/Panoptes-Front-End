import React, { Component, PropTypes } from 'react';
import HomePageSection from './generic-section';
import ProjectIcon from '../../components/project-icon';

class RecentProjectsSection extends Component {
  constructor(props) {
    super(props);
    this.toggleAllProjects = this.toggleAllProjects.bind(this);
    this.state = {
      allProjects: false,
    };
  }

  toggleAllProjects() {
    this.setState({
      allProjects: !this.state.allProjects,
    });
  }

  render() {
    const { onClose, projects, updatedProjects } = this.props;
    return (
      <HomePageSection
        title="Recent projects"
        onClose={onClose}
      >
        {(updatedProjects === 0)
        ? <div className="home-page-section__header-label">
            <p> You have no recent projects. </p>
          </div>
        : <div className="project-card-list">
          {updatedProjects.map((project) => {
            return (
              <span key={project.id}>
                <ProjectIcon project={project} badge={project.classifications} />
                &ensp;
              </span>
            );
          })}
        </div>}
        <div className="home-page-section">
          <header className="home-page-section__header">
            <button type="button" className="outlined-button" onClick={this.toggleAllProjects}>
              <div className="home-page-section__header-label">
                See all
                <br />
                <i className={this.state.allProjects ? "fa fa-chevron-up" : "fa fa-chevron-down"}></i>
              </div>
            </button>
          </header>
        </div>
        {projects.map((project) => {
          return (
            <span key={project.id}>
              <ProjectIcon project={project} badge={project.classifications} />
              &ensp;
            </span>
          );
        })}
      </HomePageSection>
    );
  }
}

RecentProjectsSection.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  projects: React.PropTypes.array.isRequired,
  updatedProjects: React.PropTypes.array.isRequired,
};

RecentProjectsSection.defaultProps = {
  onClose: () => {},
  projects: [],
  updatedProjects: [],
};

export default RecentProjectsSection;
