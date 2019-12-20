import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledWorkflowsSection = styled.div`
  border-left: 1px solid #979797;
  min-height: 2em;
  padding: 0 2em 0 1em;
  width: 100%;
`;

function Section({ children }) {
  return (
    <StyledWorkflowsSection>
      {children}
    </StyledWorkflowsSection>
  );
}

Section.propTypes = {
  children: PropTypes.node.isRequired
};

export default Section;
