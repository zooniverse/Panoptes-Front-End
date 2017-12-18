import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

const H1 = styled.h1`
  color: #fff;
  font-family: Karla;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: -0.066666667rem;
  line-height: 1.2;
  text-shadow: 0 0.133333333rem 0.266666667rem rgba(0,0,0,0.5);
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;

function ProjectTitle({ link, title }) {
  return (
    <H1>
      <StyledLink to={`${link}?facelift=true`}>
        {title}
      </StyledLink>
    </H1>
  );
}

ProjectTitle.propTypes = {
  link: PropTypes.string,
  title: PropTypes.string
};

export default ProjectTitle;
