import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import icons from '../../icons';

export const StyledDrawingToolButtonIcon = styled.span`
  color: ${props => props.color};
  margin-right: 1ch;

  > svg {
    fill-opacity: 0.1;
    height: 1.5em;
    stroke: currentColor;
    stroke-width: 5;
    vertical-align: bottom;
    width: 1.5em;
  }
`;

export default function DrawingToolInputIcon(props) {
  return (
    <StyledDrawingToolButtonIcon color={props.tool.color}>{icons[props.tool.type]}</StyledDrawingToolButtonIcon>
  );
}

DrawingToolInputIcon.defaultProps = {
  tool: {
    color: '',
    type: ''
  }
};

DrawingToolInputIcon.propTypes = {
  tool: PropTypes.shape({
    color: PropTypes.string,
    type: PropTypes.string
  })
};
