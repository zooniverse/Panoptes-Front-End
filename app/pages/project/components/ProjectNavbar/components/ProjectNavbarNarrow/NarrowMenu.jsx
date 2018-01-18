import React, { PropTypes } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import NavLink from '../NavLink';

import { theme, pxToRem } from '../../../../../../theme';

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
  background-color: ${props => props.theme.colors.teal.mid};
`;

const StyledNavLink = styled(NavLink)`
  line-height: 3.071428571;
  padding: 0 ${pxToRem(30)};

  &:hover, &:focus {
    background-color: ${props => props.theme.colors.brand.default};
  }

  &.active {
    background-color: ${props => props.theme.colors.brand.default};
  }
`;

function NarrowMenu({ links, open = true, toggleMenuFn }) {
  const openClass = (open) ? 'open' : '';
  return (
    <MenuWrapper className={openClass}>
      <ThemeProvider theme={theme}>
        <Menu>
          {links.map(link => (
            <StyledNavLink
              {...link}
              key={link.url}
              onClick={toggleMenuFn}
            />
          ))}
        </Menu>
      </ThemeProvider>
        
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
