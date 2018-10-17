import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withSizes from 'react-sizes';
import Avatar from '../Avatar';
import Background from '../Background';
import NarrowMenu from './NarrowMenu';
import NarrowMenuButton from './NarrowMenuButton';
import ProjectTitle from '../ProjectTitle';
import { pxToRem } from '../../../../../../theme';
import StyledHeader from '../StyledHeader';
import Wrapper from '../Wrapper';

export const StyledBackground = styled(Background)`
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(4)} 0 rgba(0,0,0,0.5);
`;

export const StyledOuterWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

export const StyledInnerWrapper = styled(Wrapper)`
  flex-direction: column;
  justify-content: center;
  padding: ${pxToRem(20)} 0;
`;

export class ProjectNavbarNarrow extends Component {
  constructor() {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      menuOpen: false
    };
  }

  handleOpen() {
    this.setState((prevState) => {
      return { menuOpen: !this.state.menuOpen };
    });
  }

  render() {
    const {
      avatarSrc,
      backgroundSrc,
      children,
      height,
      launched,
      projectLink,
      projectTitle,
      navLinks,
      redirect,
      underReview
    } = this.props;

    return (
      <StyledHeader>
        <StyledBackground src={backgroundSrc} />

        <StyledOuterWrapper>
            {children}
          <StyledInnerWrapper>
            <Avatar
              src={avatarSrc}
              projectTitle={projectTitle}
              size={40}
            />
            <ProjectTitle
              launched={launched}
              link={projectLink}
              redirect={redirect}
              title={projectTitle}
              underReview={underReview}
            />
            <NarrowMenuButton
              open={this.state.menuOpen}
              onClick={this.handleOpen}
            />
            <NarrowMenu
              height={height}
              toggleMenuFn={this.handleOpen}
              open={this.state.menuOpen}
              links={navLinks}
            />
          </StyledInnerWrapper>
        </StyledOuterWrapper>

      </StyledHeader>
    );
  }
}

ProjectNavbarNarrow.defaultProps = {
  avatarSrc: '',
  backgroundSrc: '',
  children: null,
  navLinks: [
    { url: '' }
  ],
  projectLink: '',
  projectTitle: ''
};

ProjectNavbarNarrow.propTypes = {
  avatarSrc: PropTypes.string,
  backgroundSrc: PropTypes.string,
  children: PropTypes.node,
  height: PropTypes.number,
  launched: PropTypes.bool,
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string
  })),
  projectLink: PropTypes.string,
  projectTitle: PropTypes.string,
  redirect: PropTypes.string,
  underReview: PropTypes.bool
};

const mapSizesToProps = ({ height }) => ({
  height
});

export default withSizes(mapSizesToProps)(ProjectNavbarNarrow);
