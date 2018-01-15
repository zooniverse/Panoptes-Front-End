import PropTypes from 'prop-types';
import React from 'react';
import HomePageSection from './generic-section';
import ProjectIcon from '../../components/project-icon';

class RecentProjectsSection extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAllProjects = this.toggleAllProjects.bind(this);
    this.state = {
      allProjects: false
    };
  }

  toggleAllProjects() {
    this.setState({
      allProjects: !this.state.allProjects
    });
  }

  render() {
    const { onClose, projects } = this.props;
    const visibleProjects = projects.slice(0, 5);
    const hiddenProjects = projects.slice(5);
    const className = this.state.allProjects ? 'open' : 'closed';
    return (
      <HomePageSection
        title="Recent projects"
        onClose={onClose}
      >
        {(projects === 0)
        ? <div className="home-page-section__header-label">
            <p> You have no recent projects. </p>
          </div>
        : [<div key="project-header" className="home-page-section__sub-header">
            <a href="/#projects" className="outlined-button" onClick={this.toggleAllProjects}>
              <span className="home-page-section__header-label">
                See all
              </span>
            </a>
          </div>, 
          <div key="project-list" className="project-card-list">
            <span>
            {visibleProjects.map((project) => {
              return (
                <ProjectIcon key={project.id} project={project} badge={project.classifications} />
              );
            })}
            </span>
            <span className={className}>
            {hiddenProjects.map((project) => {
              return (
                <ProjectIcon key={project.id} project={project} badge={project.classifications} />
              );
            })}
            </span>
        </div>]}
      </HomePageSection>
    );
  }
}

RecentProjectsSection.propTypes = {
  onClose: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired
};

RecentProjectsSection.defaultProps = {
  onClose: () => {},
  projects: []
};

export default RecentProjectsSection;