import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../theme';

export const StyledTaskHelpButton = styled.button.attrs({
  type: 'button'
})`
  background-color: transparent;
  border: none;
  color: ${theme('mode', {
    light: zooTheme.colors.teal.dark
  })};
  cursor: pointer;
  display: inline-block;
  font-size: ${pxToRem(14)};
  letter-spacing: ${pxToRem(1)};
  margin-bottom: ${pxToRem(20)};  
  margin-top: ${pxToRem(20)};
  text-align: center;
  text-transform: uppercase;
  width: 100%;
`;

export default function TaskHelpButton(props) {
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <StyledTaskHelpButton onClick={props.onClick}>
        <Translate content="classifier.taskHelpButton" />
      </StyledTaskHelpButton>
    </ThemeProvider>
  );
}

TaskHelpButton.defaultProps = {
  onClick: () => {}
};

TaskHelpButton.propTypes = {
  onClick: PropTypes.func
};

