import counterpart from 'counterpart';
import React, { PropTypes } from 'react';
import styled from 'styled-components';

// This is a totally non-semantic div, but using a button requires using
// !important to override the global button styles.
const OpenMenuButton = styled.div`
  background-color: transparent;
  border: 0;
  border-radius: 30rem;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 0.933333333rem;
  letter-spacing: 0.1rem;
  line-height: 1.13;
  margin: 0.666666667rem 0 0;
  padding: 0.466666667rem 0.4rem 0.333333333rem 1.2rem;
  text-transform: uppercase;
  text-shadow: 0 0.133333333rem 0.133333333rem rgba(0,0,0,0.22);
  transition: background 0.2s ease-out;

  &:hover,
  &.open {
    background-color: #ADDDE0;
    color: #000;
  }

  & i {
    font-size: 1.333333333rem;
    vertical-align: middle;
    position: relative;
    top: -0.133333333rem;
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
