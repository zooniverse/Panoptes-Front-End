import PropTypes from 'prop-types';
import React from 'react';

import Container from './components/Container';
import ToggleButton from './components/ToggleButton';
import Section from './components/Section';
import Heading from '../Heading';
import ProgressBar from '../ProgressBar';

function WorkflowsShowing({ project, toggleWorkflows }) {
  return (
    <Container>
      <ToggleButton
        icon={<i className="fa fa-chevron-up fa-lg" />}
        handleClick={toggleWorkflows}
      />
      <Section>
        {project.workflows.map(workflow => (
          <div key={workflow.id}>
            <Heading
              resource={workflow}
              title={workflow.display_name}
            />
            <ProgressBar
              resource={workflow}
              height="small"
            />
          </div>
        ))}
      </Section>
    </Container>
  );
}

WorkflowsShowing.propTypes = {
  project: PropTypes.shape({
    workflows: PropTypes.arrayOf(
      PropTypes.shape({
        display_name: PropTypes.string,
        id: PropTypes.string
      })
    )
  }).isRequired,
  toggleWorkflows: PropTypes.func.isRequired
};

export default WorkflowsShowing;
