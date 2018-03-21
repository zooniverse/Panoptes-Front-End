import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken } from 'polished';
import Translate from 'react-translate-component';
import RestartButton from '../../../../restart-button';
import Tutorial from '../../../../tutorial';
import { pxToRem, zooTheme } from '../../../../../theme';

export const StyledRestartButton = styled(RestartButton)`
  background-color: ${theme('mode', {
    light: zooTheme.colors.background
  })};
  border: 1px solid ${theme('mode', {
    light: darken(0.05, zooTheme.colors.background)
  })};
  color: black;
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
      light: zooTheme.colors.teal.hoverGradient
    })};
    color: white;
  }
`;

export default function TutorialTab(props, context) {
  const shouldRender = props.tutorial && props.tutorial.steps && (props.tutorial.steps.length > 0);
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
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
