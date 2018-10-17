import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from '../Avatar';
import Background from '../Background';
import NavLink from '../NavLink';
import ProjectTitle from '../ProjectTitle';
import StyledHeader from '../StyledHeader';
import Wrapper from '../Wrapper';
import { pxToRem } from '../../../../../../theme';

export const StyledHeaderWide = styled(StyledHeader)`
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(4)} 0 rgba(0,0,0,0.5);
`;

export const StyledOuterWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  height: 20vh;
  max-height: ${pxToRem(150)};
  min-height: ${pxToRem(120)};
  margin: 0 3vw;
  z-index: 2;
`;

export const StyledAvatar = styled(Avatar)`
  margin: 0 ${pxToRem(20)} 0 0;
  
  .rtl & {
    margin: 0 0 0 ${pxToRem(20)};
  }
`;

export const StyledWrapper = styled(Wrapper)`
  box-sizing: border-box;
  margin: 0;
  padding: 0 ${pxToRem(10)};
`;

export const Nav = styled.nav`
  flex: 1;
  margin-left: ${pxToRem(20)};
`;

export const List = styled.ul`
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
`;

export const ListItem = styled.li`
  display: inline;
  list-style: none;

  &:not(:last-of-type)::after {
    content: " ";
    font-size: 0;
    line-height: 0;
    margin-right: ${pxToRem(30)};
    white-space: pre;
  }
`;

export const StyledNavLink = styled(NavLink)`
  border-bottom: ${pxToRem(3)} solid transparent;
  display: inline-block;
  margin-top: ${pxToRem(2)};

  &:hover,
  &.active {
    border-color: white;
  }
`;

function ProjectNavbarWide(props) {

  const {
    avatarSrc,
    backgroundSrc,
    children,
    launched,
    navLinks,
    projectTitle,
    projectLink,
    redirect,
    underReview,
    ...otherProps
  } = props;

  return (
    <StyledHeaderWide {...otherProps}>
      <Background src={backgroundSrc} />
      <StyledOuterWrapper>
          {children}
        <StyledWrapper>
          <StyledAvatar
            src={avatarSrc}
            projectTitle={projectTitle}
            size={80}
          />
          <ProjectTitle
            launched={launched}
            link={projectLink}
            redirect={redirect}
            title={projectTitle}
            underReview={underReview}
          />
          <Nav>
            <List>
              {navLinks.map(link => (
                <ListItem key={link.url || link.to}>
                  <StyledNavLink {...link} />
                </ListItem>))}
            </List>
          </Nav>
        </StyledWrapper>
      </StyledOuterWrapper>
    </StyledHeaderWide>
  );
}

ProjectNavbarWide.propTypes = {
  avatarSrc: PropTypes.string,
  backgroundSrc: PropTypes.string,
  children: PropTypes.node,
  launched: PropTypes.bool,
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string
  })),
  projectLink: PropTypes.string,
  projectTitle: PropTypes.string,
  redirect: PropTypes.string,
  underReview: PropTypes.bool
};

export default ProjectNavbarWide;
