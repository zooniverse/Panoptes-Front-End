import counterpart from 'counterpart';
import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { colors, pxToRem } from '../../styledHelpers';

// This is a totally non-semantic div, but using a button requires using
// !important (a lot) to override the global button styles.
const OpenMenuButton = styled.div`
  background-color: transparent;
  border: 0;
  border-radius: ${pxToRem(500)};
  color: white;
  cursor: pointer;
  display: block;
  font-size: ${pxToRem(14)};
  letter-spacing: ${pxToRem(1.5)};
  line-height: 1.13;
  margin: ${pxToRem(10)} 0 0;
  padding: ${pxToRem(7)} ${pxToRem(6)} ${pxToRem(5)} 1.2rem;
  text-transform: uppercase;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(2)} rgba(0,0,0,0.22);
  transition: background 0.2s ease-out;

  &:hover,
  &.open {
    background-color: ${colors.offwhite};
    color: black;
  }

  & i {
    font-size: ${pxToRem(20)};
    position: relative;
    top: ${pxToRem(-2)};
    vertical-align: middle;
  }
`;

function NarrowMenuButton({ onClick, open }) {
  const icon = (open) ? 'fa-angle-up' : 'fa-angle-down';
  const className = (open) ? 'open' : '';
  return (
    <OpenMenuButton onClick={onClick} className={className}>
      {counterpart('project.nav.exploreProject')}
      <i className={`fa fa-fw ${icon}`} />
    </OpenMenuButton>
  );
}

NarrowMenuButton.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool
};

NarrowMenuButton.defaultProps = {
  open: false
};

export default NarrowMenuButton;
