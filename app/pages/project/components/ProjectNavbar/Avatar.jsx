import React, { PropTypes } from 'react';
import styled from 'styled-components';

const styles = () => `
  height: 80px;
  width: 80px;
  border-radius: 100%;
  display: block;
  margin-right: 30px;
  box-shadow: 5px 10px 20px 0 rgba(0,0,0,0.22);
`;

const Img = styled.img`
  ${styles()}
`;

const DefaultImg = styled.div`
  ${styles()}
  background: url("/assets/simple-pattern.png") repeat;
  background-size: 45px;
`;

function Avatar({ projectTitle, src }) {
  const avatar = (<Img
    alt={`Project icon for ${projectTitle}`}
    src={src}
  />);

  const defaultAvatar = (
    <DefaultImg aria-label="Default project icon" />
  );

  return (src) ? avatar : defaultAvatar;
}

Avatar.defaultProps = {
  projectTitle: '',
  src: ''
};

Avatar.propTypes = {
  projectTitle: PropTypes.string,
  src: PropTypes.string
};

export default Avatar;
