import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import Wrapper from '../Wrapper';
import Avatar from '../Avatar';
import ProjectTitle from '../ProjectTitle';
import StyledHeader from '../StyledHeader';
import Background from '../Background';
import { pxToRem } from '../../styledHelpers';

const StyledAvatar = styled(Avatar)`
  margin-right: ${pxToRem(20)};
`;

const StyledWrapper = styled(Wrapper)`
  box-sizing: border-box;
  min-height: ${pxToRem(150)};
  padding: 0 ${pxToRem(10)};
`;

class ProjectNavbarWide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { backgroundSrc, avatarSrc, projectTitle, projectLink } = this.props;
    return (
      <StyledHeader>
        <Background src={backgroundSrc} />
        <StyledWrapper>
          <StyledAvatar
            src={avatarSrc}
            projectTitle={projectTitle}
            size={5.333333333}
          />
          <ProjectTitle
            link={projectLink}
            title={projectTitle}
          />
        </StyledWrapper>
      </StyledHeader>
    );
  }
}

ProjectNavbarWide.propTypes = {
  avatarSrc: PropTypes.string,
  backgroundSrc: PropTypes.string,
  navLinks: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string
  })),
  projectLink: PropTypes.string,
  projectTitle: PropTypes.string
};

export default ProjectNavbarWide;
