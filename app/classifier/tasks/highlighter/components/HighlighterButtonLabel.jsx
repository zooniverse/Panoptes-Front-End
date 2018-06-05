import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Markdown } from 'markdownz';

export const StyledHighLighterButtonLabel = styled.span`
  align-items: baseline;
  flex-grow: 1;
  flex-wrap: wrap;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .markdown {
    display: inline-block;
  }

  .markdown p {
    margin: 0;
  }

  > i {
    color: ${props => props.color};
    margin-right: 1ch;
  }
`;

export default function HighlighterButtonLabel({ color, label }) {
  return (
    <StyledHighLighterButtonLabel color={color}>
      <i className="fa fa-i-cursor" aria-hidden="true" />
      <Markdown>{label}</Markdown>
    </StyledHighLighterButtonLabel>
  );
}

HighlighterButtonLabel.defaultProps = {
  color: '',
  label: ''
};

HighlighterButtonLabel.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string
};
