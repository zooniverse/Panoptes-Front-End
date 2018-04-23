import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken, lighten } from 'polished';
import Translate from 'react-translate-component';
import RestartButton from '../../../../restart-button';
import Tutorial from '../../../../tutorial';
import { pxToRem, zooTheme } from '../../../../../theme';

export const StyledRestartButton = styled(RestartButton)`
  background-color: ${theme('mode', {
    dark: darken(0.04, zooTheme.colors.darkTheme.background.default),
    light: zooTheme.colors.lightTheme.background.default
  })};
  border: 1px solid ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: darken(0.05, zooTheme.colors.lightTheme.background.default)
  })};
  color: ${theme('mode', {
    dark: lighten(0.45, zooTheme.colors.darkTheme.background.default),
    light: zooTheme.colors.lightTheme.font
  })};
  cursor: pointer;
  display: inline-block;
  flex: 0 0 50%;
  font-size: ${pxToRem(14)};
  font-weight: bold;
  letter-spacing: ${pxToRem(1)};
  padding: ${pxToRem(16)};
  text-transform: uppercase;

  &:focus, &:hover {
    background: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.button,
      light: zooTheme.colors.teal.gradient
    })};
    color: ${theme('mode', {
      dark: zooTheme.colors.darkTheme.font,
      light: 'white'
    })};
  }
`;

function TutorialTab(props, context) {
  const shouldRender = props.tutorial && props.tutorial.steps && (props.tutorial.steps.length > 0);
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledRestartButton
        preferences={props.projectPreferences}
        shouldRender={shouldRender}
        start={Tutorial.start.bind(Tutorial, props.tutorial, props.user, props.projectPreferences, context.geordi, context.store)}
        user={props.user}
        workflow={props.workflow}
      >
        <Translate content="classifier.tutorialButton" />
      </StyledRestartButton>
    </ThemeProvider>
  );
}

TutorialTab.defaultProps = {
  tutorial: { steps: [] }
};

TutorialTab.propTypes = {
  projectPreferences: PropTypes.object,
  theme: PropTypes.string,
  tutorial: PropTypes.shape({
    steps: PropTypes.array
  }),
  user: PropTypes.object,
  workflow: PropTypes.object
};

TutorialTab.contextTypes = {
  geordi: PropTypes.object,
  store: PropTypes.object
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});


export default connect(mapStateToProps)(TutorialTab);
