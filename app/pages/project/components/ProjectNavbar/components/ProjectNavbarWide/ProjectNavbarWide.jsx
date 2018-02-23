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

export const StyledHeaderWide = StyledHeader.extend`
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(4)} 0 rgba(0,0,0,0.5);
`;

export const StyledAvatar = styled(Avatar)`
  margin-right: ${pxToRem(20)};
`;

export const StyledWrapper = styled(Wrapper)`
  box-sizing: border-box;
  min-height: ${pxToRem(150)};
  padding: 0 ${pxToRem(10)};
`;

export const Nav = styled.nav`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  margin-left: ${pxToRem(20)};

  > span {
    margin-right: ${pxToRem(30)} !important; 
  }
`;

export const StyledNavLink = styled(NavLink)`
  border-bottom: ${pxToRem(3)} solid transparent;
  margin-top: ${pxToRem(2)};

  &:hover,
  &.active {
    border-color: white;
  }

  &:not(:last-of-type) {
    margin-right: ${pxToRem(30)};
  }
`;

function ProjectNavbarWide(props) {

  const {
    avatarSrc,
    backgroundSrc,
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
          {navLinks.map(link => <StyledNavLink key={link.url || link.to} {...link} />)}
        </Nav>
      </StyledWrapper>
    </StyledHeaderWide>
  );
}

ProjectNavbarWide.propTypes = {
  avatarSrc: PropTypes.string,
  backgroundSrc: PropTypes.string,
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
