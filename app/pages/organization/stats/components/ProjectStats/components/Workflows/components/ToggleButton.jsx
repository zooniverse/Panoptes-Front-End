import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledWorkflowsToggleButton = styled.button`
  background-color: none;
  border: none;
  margin-right: 1em;
`;

function ToggleButton({ icon, handleClick }) {
  return (
    <StyledWorkflowsToggleButton
      type="button"
      onClick={() => handleClick()}
    >
      {icon}
    </StyledWorkflowsToggleButton>
  );
}

ToggleButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired
};

export default ToggleButton;
