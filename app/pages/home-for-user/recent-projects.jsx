import React from 'react';
import ReactDOM from 'react-dom';
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

  componentDidUpdate() {
    !this.state.allProjects && ReactDOM.findDOMNode(this).scrollIntoView();
  }

  toggleAllProjects() {
    this.setState({
      allProjects: !this.state.allProjects
    });
  }

  render() {
    const { onClose, projects } = this.props;
    const visibleProjects = projects.slice(0, 4);
    const hiddenProjects = projects.slice(4);
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
            <a href="/#focus=projects" className="outlined-button" onClick={this.toggleAllProjects}>
              <span className="home-page-section__header-label">
                See all
              </span>
            </a>
          </div>, 
          <div key="project-list" className="project-card-list">
            <span>
            {visibleProjects.map((project) => {
              return (
                <span key={project.id}>
                  <ProjectIcon project={project} badge={project.classifications} />
                  &ensp;
                </span>
              );
            })}
            </span>
            <span className={className}>
            {hiddenProjects.map((project) => {
              return (
                <span key={project.id}>
                  <ProjectIcon project={project} badge={project.classifications} />
                  &ensp;
                </span>
              );
            })}
            </span>
        </div>]}
      </HomePageSection>
    );
  }
}

RecentProjectsSection.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  projects: React.PropTypes.array.isRequired
};

RecentProjectsSection.defaultProps = {
  onClose: () => {},
  projects: []
};

export default RecentProjectsSection;
