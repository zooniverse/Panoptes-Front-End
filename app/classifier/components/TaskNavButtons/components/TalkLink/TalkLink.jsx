import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken, lighten } from 'polished';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../../theme';

// These hasn't been moved into the zoo theme because the button might go away
const TALK_LINK_BLUE = '#43bbfd';
const TALK_LINK_BLUE_HOVER = '#69c9fd';
const TALK_LINK_BLUE_HOVER_DARK = '#104A79';

const commonStyles = `
  box-sizing: border-box;
  display: inline-block;
  flex: 2 0;
  line-height: 2em;
  margin: 0;
  padding: 0.4em 1.4em;
  position: relative;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
`;

export const StyledTalkLink = styled(Link)`
  ${commonStyles}
  cursor: pointer;    
  
  background: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: TALK_LINK_BLUE
  })};
  border: ${theme('mode', {
    dark: `thin solid ${TALK_LINK_BLUE}`,
    light: 'thin solid transparent'
  })};
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: 'white'
  })};

  &:hover, &:focus {
    background: ${theme('mode', {
      dark: TALK_LINK_BLUE_HOVER_DARK,
      light: darken(0.25, TALK_LINK_BLUE_HOVER)
    })};
    border: ${theme('mode', {
      dark: `thin solid ${TALK_LINK_BLUE}`,
      light: `thin solid ${darken(0.25, TALK_LINK_BLUE_HOVER)}`
    })};
  }
`;

// can't style the cursor and pointer-events: none simulatenously
export const StyledDisabledTalkPlaceholder = styled.span`
  ${commonStyles}
  background: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.background.default,
    light: TALK_LINK_BLUE
  })};
  border: ${theme('mode', {
    dark: `thin solid ${TALK_LINK_BLUE}`,
    light: 'thin solid transparent'
  })};
  color: ${theme('mode', {
    dark: zooTheme.colors.darkTheme.font,
    light: 'white'
  })};
  cursor: not-allowed;
  opacity: 0.5;
`;

// TODO: Add Seven-Ten visibility split wrapper
// because we want to test removing the talk links from the classifier task area
export function TalkLink({ disabled, onClick, projectSlug, subjectId, theme, translateContent }) {
  if (disabled) {
    return (
      <ThemeProvider theme={{ mode: theme }}>
        <StyledDisabledTalkPlaceholder>
          <Translate content={translateContent} />
        </StyledDisabledTalkPlaceholder>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <StyledTalkLink
        onClick={onClick}
        to={`/projects/${projectSlug}/talk/subjects/${subjectId}`}
      >
        <Translate content={translateContent} />
      </StyledTalkLink>
    </ThemeProvider>
  );
}

TalkLink.defaultProps = {
  disabled: false,
  onClick: () => {},
  projectSlug: '',
  subjectId: '',
  translateContent: 'classifier.talk'
};

TalkLink.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  projectSlug: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
  translateContent: PropTypes.string
};

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(TalkLink);
