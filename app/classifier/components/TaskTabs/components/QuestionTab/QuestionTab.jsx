import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { lighten } from 'polished';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../../theme';

export const StyledQuestionTab = styled.button.attrs({
  type: 'button'
}) `
  background-color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: 'white'
  })};
  border: none;
  color: ${theme('mode', {
    dark: lighten(0.45, zooTheme.colors.darkTheme.background.default),
    light: zooTheme.colors.lightTheme.font
  })};
  display: inline-block;
  flex: 0 0 50%;
  font-size: ${pxToRem(14)};
  font-weight: bold;
  letter-spacing: ${pxToRem(1)};
  padding: ${pxToRem(16)};
  text-transform: uppercase;
`;

function QuestionTab(props) {
  return (
    <ThemeProvider theme={{ mode: props.theme }}>
      <StyledQuestionTab>
        <Translate content="classifier.question" />
      </StyledQuestionTab>
    </ThemeProvider>
  );
}

QuestionTab.propTypes = {
  theme: PropTypes.string
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});


export default connect(mapStateToProps)(QuestionTab);
