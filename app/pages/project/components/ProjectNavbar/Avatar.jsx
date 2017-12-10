import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Img = styled.img`
  height: 80px;
  width: 80px;
  border-radius: 100%;
  display: block;
  margin-right: 30px;
  box-shadow: 5px 10px 20px 0 rgba(0,0,0,0.22);
`;

function Avatar({ projectTitle, src }) {
  const alt = projectTitle ? `Project icon for ${projectTitle}` : 'Default project icon';

  return <Img alt={alt} src={src} />;
}

Avatar.defaultProps = {
  projectTitle: '',
  src: 'https://placeimg.com/80/80/animals'
};

Avatar.propTypes = {
  projectTitle: PropTypes.string,
  src: PropTypes.string
};

export default Avatar;
