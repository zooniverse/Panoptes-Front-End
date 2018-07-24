import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledDrawingToolInputStatus = styled.div`
  font-size: 0.8em;
  opacity: 0.7;
`;

// TODO Add Translations
export default function DrawingToolInputStatus({ count, tool }) {
  const minStyleColor = (count < tool.min) ? 'red' : '';
  const maxStyleColor = (count === tool.max) ? 'orange' : '';
  return (
    <StyledDrawingToolInputStatus>
      {count}{' '}
      {(!!tool.min || !!tool.max) &&
        'of '}
      {!!tool.min &&
        <span style={{ color: minStyleColor }}>{tool.min} required</span>}
      {!!tool.min && !!tool.max &&
        ', '}
      {!!tool.max &&
        <span style={{ color: maxStyleColor }}>{tool.max} maximum</span>}
      {' '}drawn
    </StyledDrawingToolInputStatus>
  );
}

DrawingToolInputStatus.defaultProps = {
  count: 0,
  tool: {}
};

DrawingToolInputStatus.propTypes = {
  count: PropTypes.number,
  tool: PropTypes.shape({
    min: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    max: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  })
};
