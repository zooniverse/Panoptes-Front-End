import React, { PropTypes } from 'react';
import styled from 'styled-components';
import NavLink from '../NavLink';
import { colors, pxToRem } from '../../styledHelpers';

const MenuWrapper = styled.div`
  max-width: ${pxToRem(300)};
  overflow: hidden;
  position: absolute;
  top: 100%;
  transform: translateY(-100%);
  transition: transform 0.3s ease-out;
  width: 100%;
  z-index: 10;

  &.open {
    transform: translateY(0);
  }
`;

const Menu = styled.nav`
  background-color: ${colors.teal};
`;

const StyledNavLink = styled(NavLink)`
  line-height: 3.071428571;
  padding: 0 ${pxToRem(30)};

  &:hover {
    background-color: ${colors.teal};
  }
`;

function NarrowMenu({ links, open = true, toggleMenuFn }) {
  const openClass = (open) ? 'open' : '';
  return (
    <MenuWrapper className={openClass}>
      <Menu>
        {links.map(link => <StyledNavLink
          {...link}
          key={link.url}
          onClick={toggleMenuFn}
        />)}
      </Menu>
    </MenuWrapper>
  );
}

NarrowMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string
  })),
  open: PropTypes.bool,
  toggleMenuFn: PropTypes.func
};

export default NarrowMenu;
