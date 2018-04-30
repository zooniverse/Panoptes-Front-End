import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { darken, lighten } from 'polished';
import Translate from 'react-translate-component';
import { pxToRem, zooTheme } from '../../../../../theme';

const commonStyles = `
  background: #43bbfd;
  border: 0;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  flex: 2 0;
  line-height: 2em;
  margin: 0;
  padding: 0.4em 1.4em;
  position: relative;
  text-align: center;
  text-decoration: none;
`;

export const StyledTalkLink = styled(Link)`
  ${commonStyles}

  &:hover, &:focus {
    background: #69c9fd;
  }
`;

export const StyledDisabledTalkPlaceholder = styled.span`
  ${commonStyles}
  opacity: 0.5;
  pointer-events: none;
`;

// TODO: Add Seven-Ten visibility split wrapper
// because we want to test removing the talk links from the classifier task area
export default function TalkLink({ disabled, onClick, projectSlug, subjectId, translateContent }) {
  if (disabled) {
    return (
      <StyledDisabledTalkPlaceholder>
        <Translate content={translateContent} />
      </StyledDisabledTalkPlaceholder>
    );
  }
  return (
    <StyledTalkLink
      onClick={onClick}
      to={`/projects/${projectSlug}/talk/subjects/${subjectId}`}
    >
      <Translate content={translateContent} />
    </StyledTalkLink>
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
