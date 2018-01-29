import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { IndexLink } from 'react-router';
import { colors, pxToRem } from '../../styledHelpers';

const H1 = styled.h1`
  color: white;
  font-family: Karla;
  font-size: ${pxToRem(30)};
  font-weight: bold;
  letter-spacing: ${pxToRem(-1)};
  line-height: 1.2;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(3)} rgba(0,0,0,0.5);
`;

const StyledLink = styled(IndexLink).attrs({
  activeClassName: 'active'
})`
  text-decoration: none;
  color: white;

  &:hover,
  &:focus {
    border-bottom: ${pxToRem(3)} solid white;
  }
`;

const CheckMarkWrapper = styled.span`
  font-size: 0.4em;
`;

const CheckMark = styled.i`
  color: #00979d;
`;

function ProjectTitle({ launched, link, title, underReview }) {
  return (
    <H1>
      <StyledLink to={`${link}?facelift=true`}>
        {underReview && <p><em>Under Review</em></p>}
        {title}{' '}
        {launched &&
          <CheckMarkWrapper className="fa-stack">
            <i className="fa fa-circle fa-stack-2x" />
            <CheckMark className="fa fa-check fa-stack-1x" />
          </CheckMarkWrapper>
          }
      </StyledLink>
    </H1>
  );
}

ProjectTitle.propTypes = {
  launched: PropTypes.bool,
  link: PropTypes.string,
  title: PropTypes.string,
  underReview: PropTypes.bool
};

export default ProjectTitle;
