import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { pxToRem } from '../../styledHelpers';

const StyledAvatarImg = styled.img.attrs({
  alt: props => props.alt,
  src: props => props.src
})`
  border-radius: 100%;
  display: block;
  box-shadow: ${pxToRem(1.5)} ${pxToRem(10)} ${pxToRem(20)} 0 rgba(0,0,0,0.22);
  height: ${props => pxToRem(props.size)};
  width: ${props => pxToRem(props.size)};
`;

function Avatar(props) {
  const { projectTitle, ...avatarProps } = props;

  if (projectTitle) {
    avatarProps.alt = `Project icon for ${projectTitle}`;
  }

  return <StyledAvatarImg {...avatarProps} />;
}

Avatar.defaultProps = {
  alt: 'Project icon',
  projectTitle: '',
  size: 40,
  src: '/assets/default-project-avatar.png'
};

Avatar.propTypes = {
  alt: PropTypes.string,
  projectTitle: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  src: PropTypes.string
};

export default Avatar;
