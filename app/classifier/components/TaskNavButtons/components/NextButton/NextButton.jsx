import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken, lighten } from 'polished';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../../theme';

export const StyledNextButton = styled.button.attrs({
  autoFocus: props => props.autoFocus,
  disabled: props => props.disabled,
  type: 'button'
})`
  background-color: ${theme('mode', { 
    dark: zooTheme.colors.darkTheme.background.default,
    light: zooTheme.colors.highlight.default
  })};
  border: ${theme('mode', {
    dark: `solid thin ${zooTheme.colors.highlight.default}`,
    light: `solid thin ${zooTheme.colors.highlight.default}`
  })};
  border-radius: 0;
  color: ${theme('mode', {
    dark: zooTheme.colors.highlight.default,
    light: 'white'
  })};
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
      dark: zooTheme.colors.highlight.default,
      light: zooTheme.colors.highlight.dark
    })};
    color: ${theme('mode', {
      dark: 'white',
      light: 'white'
    })};;
  }

  &:disabled {
    background: ${theme('mode', {
      dark: 'grey',
      light: zooTheme.colors.highlight.light
    })};
    color: ${theme('mode', {
      dark: 'white',
      light: '#EEF1F4'
    })};
    cursor: not-allowed;
  }
`;

export function NextButton({ autoFocus, onClick, classifierTheme, waitingForAnswer }) {
  return (
    <ThemeProvider theme={{ mode: classifierTheme }}>
      <StyledNextButton
        autoFocus={autoFocus}
        type="button"
        disabled={waitingForAnswer}
        onClick={onClick}
      >
        <Translate content="classifier.next" />
        <i className="fa fa-long-arrow-right" />
      </StyledNextButton>
    </ThemeProvider>
  );
}

NextButton.defaultProps = {
  autoFocus: false,
  classifierTheme: 'light',
  onClick: () => { },
  waitingForAnswer: false
};

NextButton.propTypes = {
  autoFocus: PropTypes.bool,
  classifierTheme: PropTypes.string,
  onClick: PropTypes.func,
  waitingForAnswer: PropTypes.bool
};

const mapStateToProps = state => ({
  classifierTheme: state.userInterface.theme
});


export default connect(mapStateToProps)(NextButton);
