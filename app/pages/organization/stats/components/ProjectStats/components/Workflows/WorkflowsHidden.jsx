import PropTypes from 'prop-types';
import React from 'react';

import Container from './components/Container';
import ToggleButton from './components/ToggleButton';
import Section from './components/Section';
import ActionText from './components/ActionText';

function WorkflowsHidden({ toggleWorkflows }) {
  return (
    <Container>
      <ToggleButton
        icon={<i className="fa fa-chevron-down fa-lg" />}
        handleClick={toggleWorkflows}
      />
      <Section>
        <ActionText
          content="organization.stats.expandWorkflowStats"
          handleClick={toggleWorkflows}
        />
      </Section>
    </Container>
  );
}

WorkflowsHidden.propTypes = {
  toggleWorkflows: PropTypes.func.isRequired
};

export default WorkflowsHidden;
