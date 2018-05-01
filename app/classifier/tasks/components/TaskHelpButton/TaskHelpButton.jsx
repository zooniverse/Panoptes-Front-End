import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import Translate from 'react-translate-component';
import theme from 'styled-theming';
import { pxToRem, zooTheme } from '../../../../theme';

export const StyledTaskHelpButton = styled.button.attrs({
  type: 'button'
})`
  background-color: transparent;
  border: none;
  color: ${theme('mode', {
    dark: zooTheme.colors.teal.light,
    light: zooTheme.colors.teal.dark
  })};
  cursor: pointer;
  display: inline-block;
  font-size: ${pxToRem(14)};
  letter-spacing: ${pxToRem(1)};
  margin-top: ${pxToRem(20)};
  text-align: center;
  text-transform: uppercase;
  width: 100%;

  &:focus, &:hover {
    text-decoration: underline;
  }
`;

export function TaskHelpButton(props) {
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledTaskHelpButton onClick={props.onClick}>
        <Translate content="classifier.taskHelpButton" />
      </StyledTaskHelpButton>
    </ThemeProvider>
  );
}

TaskHelpButton.defaultProps = {
  onClick: () => { },
  theme: 'light'
};

TaskHelpButton.propTypes = {
  onClick: PropTypes.func,
  theme: PropTypes.string
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(TaskHelpButton);

