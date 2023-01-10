import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Translate from 'react-translate-component';

const StyledWorkflowsActionText = styled.button`
  background-color: none;
  border: none;
  color: #005D69;
  font-size: .9em;
  letter-spacing: 1px;
  padding: 0;
  text-transform: uppercase;
  vertical-align: middle;
`;

function ActionText({ content, handleClick }) {
  return (
    <StyledWorkflowsActionText
      type="button"
      onClick={() => handleClick()}
    >
      <Translate
        content={content}
      />
    </StyledWorkflowsActionText>
  );
}

ActionText.propTypes = {
  content: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default ActionText;
