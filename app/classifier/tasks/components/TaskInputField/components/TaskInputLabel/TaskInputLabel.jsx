import { Markdown } from 'markdownz';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

function howShouldTheLabelBeAligned(label, labelIcon) {
  if ((label && label.includes('<img')) || ((label && label.includes('<svg')) || (label && labelIcon))) {
    return 'left';
  }

  return 'center';
}

export const StyledTaskInputLabelWrapper = styled.div`
  align-items: baseline;
  display: flex;
  position: relative;
  width: 100%;
`;

export const StyledTaskInputLabel = styled(Markdown)`
  align-items: baseline;
  flex-grow: 1;
  flex-wrap: wrap;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0;
  }

  img, svg {
    padding-left: 5px;
    padding-right: 5px;
    vertical-align: middle;
  }

  .markdown {
    text-align: ${props => howShouldTheLabelBeAligned(props.label, props.labelIcon)};
  }
`;

export default function TaskInputLabel({ label, labelIcon, labelStatus }) {
  return (
    <StyledTaskInputLabelWrapper>
      {labelIcon &&
        labelIcon}
      <StyledTaskInputLabel label={label} labelIcon={labelIcon}>
        {label}
      </StyledTaskInputLabel>
      {labelStatus &&
        labelStatus}
    </StyledTaskInputLabelWrapper>
  );
}

TaskInputLabel.defaultProps = {
  label: '',
  labelIcon: null,
  labelStatus: null
};

TaskInputLabel.propTypes = {
  label: PropTypes.string,
  labelIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  labelStatus: PropTypes.oneOfType([PropTypes.node, PropTypes.object])
};
