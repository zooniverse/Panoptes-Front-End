import React, { PropTypes } from 'react';
import styled from 'styled-components';

const commonStyles = `
  border-radius: 100%;
  display: block;
  box-shadow: 0.333333333rem 0.666666667rem 1.333333333rem 0 rgba(0,0,0,0.22);
`;

const Img = styled.img.attrs({
  alt: props => `Project icon for ${props.projectTitle}`,
  src: props => props.src
})`
  ${commonStyles}
  height: ${props => props.size}px;
  width: ${props => props.size}px;
`;

const DefaultImg = styled.div.attrs({
  'aria-label': 'Default project icon'
})`
  ${commonStyles}
  background: url("/assets/simple-pattern.jpg") repeat;
  background-position: center;
  background-size: 170%;
  height: ${props => props.size}rem;
  width: ${props => props.size}rem;
`;

function Avatar({ projectTitle, size, src }) {
  const imgProps = { projectTitle, size, src };
  return (src) ? <Img {...imgProps} /> : <DefaultImg size={size} />;
}

Avatar.defaultProps = {
  projectTitle: '',
  size: 2.666666667,
  src: ''
};

Avatar.propTypes = {
  projectTitle: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  src: PropTypes.string
};

export default Avatar;
