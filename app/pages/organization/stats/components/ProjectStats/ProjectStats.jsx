/* eslint multiline-ternary: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SectionHeading from '../SectionHeading';
import Heading from './components/Heading';
import ProgressBar from './components/ProgressBar';
import WorkflowsHidden from './components/Workflows/WorkflowsHidden';
import WorkflowsShowing from './components/Workflows/WorkflowsShowing';

const StyledProjectStats = styled.section`
  background-color: white;
  border: 1px solid #E2E5E9;
  flex: 10 1 500px;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

const StyledProjectStatBlock = styled.div`
  margin-bottom: 2em;
`;

function ProjectStats({ projectStats, toggleWorkflows }) {
  const projects = Array.from(projectStats.entries());

  return (
    <StyledProjectStats>
      <SectionHeading
        content="organization.stats.projectStats"
        withProp={{ count: projects.length }}
      />
      {projects.map(([id, project]) => (
        <StyledProjectStatBlock key={id}>
          <Heading
            resource={project}
            title={`${project.display_name} (${project.links.active_workflows.length} workflows)`}
          />
          <ProgressBar resource={project} />
          {project.show ? (
            <WorkflowsShowing
              project={project}
              toggleWorkflows={() => toggleWorkflows(id)}
            />
          ) : (
            <WorkflowsHidden
              toggleWorkflows={() => toggleWorkflows(id)}
            />
          )}
        </StyledProjectStatBlock>
      ))}
    </StyledProjectStats>
  );
}

ProjectStats.propTypes = {
  projectStats: PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.object
  }).isRequired,
  toggleWorkflows: PropTypes.func.isRequired
};

export default ProjectStats;
