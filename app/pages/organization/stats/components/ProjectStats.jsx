import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import SectionHeading from './SectionHeading';

const StyledProjectStats = styled.section`
  background-color: white;
  flex: 7 1 500px;
  margin: 1.6em .8em 0 .8em;
  padding: 2em;
`;

function ProjectStats() {
  return (
    <StyledProjectStats>
      <SectionHeading
        content="organization.stats.projectStats"
        withProp={{ count: '12' }}
      />
      <p>Projects</p>
      <p>Projects</p>
      <p>Projects</p>
      <p>Projects</p>
      <p>Projects</p>
    </StyledProjectStats>
  );
}

export default ProjectStats;
