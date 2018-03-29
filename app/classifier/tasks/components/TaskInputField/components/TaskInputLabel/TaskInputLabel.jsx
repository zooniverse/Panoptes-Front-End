import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const StyledTaskInputLabel = styled(Markdown)`
  align-items: baseline;
  flex-grow: 1;
  flex-wrap: wrap;
  text-align: ${(props) => { return (props.label && props.label.includes('<img')) ? 'left' : 'center'; }};

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  > img {
    padding-left: 5px;
    padding-right: 5px;
    vertical-align: middle;
  }

  > p {
    margin: 0;
  }
`;

export default function TaskInputLabel({ label }) {
  return (
    <StyledTaskInputLabel>{label}</StyledTaskInputLabel>
  );
}

TaskInputLabel.propTypes = {
  label: PropTypes.string
};

