import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken, lighten } from 'polished';
import Translate from 'react-translate-component';
import { zooTheme } from '../../../../../theme';

export const StyledDoneButton = styled.button.attrs({
  disabled: props => props.disabled,
  type: 'button'
})`
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.lightTheme.button.done
  })};
  border: ${theme('mode', {
    dark: `solid thin ${zooTheme.colors.darkTheme.button.done.default}`,
    light: `solid thin ${zooTheme.colors.lightTheme.button.done}`
  })};
  border-radius: 0;
  color: white;
  cursor: pointer;
  flex: 3 0;
  font-size: 0.9em;
  padding: 0.9em;
  text-transform: capitalize;

  > i {
    margin-left: 1ch;
  }

  &:hover, &:focus {
    background: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.button.done.hover,
      light: darken(0.15, zooTheme.colors.lightTheme.button.done)
    })};
    border: ${theme('mode', {
      dark: `solid thin ${zooTheme.colors.darkTheme.button.done.default}`,
      light: `solid thin ${darken(0.15, zooTheme.colors.lightTheme.button.done)}`
    })};
    color: 'white';
  }

  &:disabled {
    background: ${theme('mode', {
      dark: lighten(0.05, zooTheme.colors.darkTheme.background.default),
      light: lighten(0.05, zooTheme.colors.lightTheme.button.done)
    })};

    border: ${theme('mode', {
      dark: `solid thin ${zooTheme.colors.darkTheme.button.done.default}`,
      light: `solid thin ${lighten(0.05, zooTheme.colors.lightTheme.button.done)}`
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: '#EEF1F4'
    })};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export function DoneButton(props) {
  if (!props.completed) {
    return (
      <ThemeProvider theme={{ mode: props.theme }}>
        <StyledDoneButton
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.demoMode && <i className="fa fa-trash fa-fw" />}
          {props.goldStandardMode && <i className="fa fa-star fa-fw" />}
          {' '}<Translate content="classifier.done" />
        </StyledDoneButton>
      </ThemeProvider>
    );
  }

  return null;
}

DoneButton.defaultProps = {
  completed: false,
  demoMode: false,
  disabled: false,
  goldStandardMode: false,
  onClick: () => {},
  theme: 'light'
};

DoneButton.propTypes = {
  completed: PropTypes.bool,
  demoMode: PropTypes.bool,
  disabled: PropTypes.bool,
  goldStandardMode: PropTypes.bool,
  onClick: PropTypes.func,
  theme: PropTypes.string
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});


export default connect(mapStateToProps)(DoneButton);
