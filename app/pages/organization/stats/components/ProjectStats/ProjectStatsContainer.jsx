import PropTypes from 'prop-types';
import React from 'react';

import getWorkflowsInOrder from '../../../../../lib/get-workflows-in-order';
import ProjectStats from './ProjectStats';

class ProjectStatsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectStats: new Map()
    };

    this.initProjectStats = this.initProjectStats.bind(this);
    this.toggleWorkflows = this.toggleWorkflows.bind(this);
  }

  componentDidMount() {
    this.initProjectStats();
  }

  componentDidUpdate(prevProps) {
    const { projects, projectAvatars } = this.props;

    if (prevProps.projects !== projects || prevProps.projectAvatars !== projectAvatars) {
      this.initProjectStats();
    }
  }

  initProjectStats() {
    const { projects, projectAvatars } = this.props;
    const { projectStats } = this.state;
    const newProjectStats = new Map(projectStats);

    const liveProjects = projects.filter(project => project.launch_approved && project.state === 'live');

    liveProjects.forEach((project, index) => {
      let projectAvatar = projectAvatars.find(avatar => avatar.links.linked.id === project.id);
      if (!projectAvatar) {
        projectAvatar = { src: '' };
      }

      if (index === 0) {
        getWorkflowsInOrder(project, {
          active: true,
          fields: 'completeness,configuration,display_name'
        })
          .then((workflows) => {
            newProjectStats.set(project.id, Object.assign({}, project, {
              avatarSrc: projectAvatar.src,
              show: true,
              workflows
            }));
          });
      }
      newProjectStats.set(project.id, Object.assign({}, project, {
        avatarSrc: projectAvatar.src,
        show: false,
        workflows: []
      }));
    });

    this.setState({ projectStats: newProjectStats });
  }

  toggleWorkflows(projectId) {
    const { projects } = this.props;
    const { projectStats } = this.state;
    const newProjectStats = new Map(projectStats);
    const projectStat = newProjectStats.get(projectId);
    const [project] = projects.filter(orgProject => orgProject.id === projectId);

    let newProjectStat;
    if (projectStat.workflows.length === 0) {
      getWorkflowsInOrder(project, {
        active: true,
        fields: 'completeness,configuration,display_name'
      })
        .then((workflows) => {
          newProjectStat = Object.assign({}, projectStat, { show: !projectStat.show, workflows });
          newProjectStats.set(projectId, newProjectStat);
          this.setState({ projectStats: newProjectStats });
        });
    } else {
      newProjectStat = Object.assign({}, projectStat, { show: !projectStat.show });
      newProjectStats.set(projectId, newProjectStat);
      this.setState({ projectStats: newProjectStats });
    }
  }

  render() {
    const { projectStats } = this.state;

    return (
      <ProjectStats
        projectStats={projectStats}
        toggleWorkflows={this.toggleWorkflows}
      />
    );
  }
}

ProjectStatsContainer.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  ).isRequired,
  projectAvatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string
    })
  )
};

ProjectStatsContainer.defaultProps = {
  projectAvatars: []
};

export default ProjectStatsContainer;
