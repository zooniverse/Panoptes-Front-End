import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledWorkflows = styled.div`
  align-items: flex-start;
  display: flex;
  margin-top: 1em;
`;

function Container({ children }) {
  return (
    <StyledWorkflows>
      {children}
    </StyledWorkflows>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired
};

export default Container;
