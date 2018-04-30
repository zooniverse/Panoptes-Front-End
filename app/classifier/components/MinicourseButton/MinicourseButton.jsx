import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import Translate from 'react-translate-component';
import { VisibilitySplit } from 'seven-ten';
import RestartButton from '../../restart-button';
import MiniCourse from '../../mini-course';
import { pxToRem, zooTheme } from '../../../theme';

export const StyledRestartButton = styled(RestartButton).attrs({
  type: 'button'
})`
  background-color: transparent;
  border: none;
  color: ${
    theme('mode', {
      dark: zooTheme.colors.teal.light,
      light: zooTheme.colors.teal.dark
    })
  };
  cursor: pointer;
  display: inline-block;
  font-size: ${ pxToRem(14) };
  letter-spacing: ${ pxToRem(1) };
  margin-bottom: ${ pxToRem(20) };
  margin-top: ${ pxToRem(20) };
  text-align: center;
  text-transform: uppercase;
  width: 100%;

    &:focus, &:hover {
    text-decoration: underline;
  }
`;

export function MinicourseButton(props, context) {
  const shouldRender = props.minicourse && props.user && props.minicourse.steps && (props.minicourse.steps.length > 0);
  return (
    <VisibilitySplit splits={props.splits} splitKey={'mini-course.visible'} elementKey={'div'}>
      <ThemeProvider theme={{ mode: props.theme }}>
        <StyledRestartButton
          preferences={props.projectPreferences}
          shouldRender={shouldRender}
          start={MiniCourse.restart.bind(MiniCourse, props.minicourse, props.projectPreferences, props.user, context.geordi, context.store)}
          user={props.user}
          workflow={props.workflow}
        >
          <Translate content="classifier.miniCourseButton" />
        </StyledRestartButton>
      </ThemeProvider>
    </VisibilitySplit>
  );
}

MinicourseButton.defaultProps = {
  theme: 'light'
};

MinicourseButton.propTypes = {
  minicourse: PropTypes.shape({
    steps: PropTypes.array
  }),
  projectPreferences: PropTypes.object,
  splits: PropTypes.object,
  theme: PropTypes.string,
  user: PropTypes.object,
  workflow: PropTypes.object
};

MinicourseButton.contextTypes = {
  geordi: PropTypes.object,
  store: PropTypes.object
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(MinicourseButton);
