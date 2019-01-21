import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';
import { IndexLink } from 'react-router';
import counterpart from 'counterpart';
import { pxToRem, zooTheme } from '../../../../../../theme';


export const H1 = styled.h1`
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Karla;
  font-size: ${pxToRem(27)};
  font-weight: bold;
  letter-spacing: ${pxToRem(-1)};
  line-height: 0.9;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(3)} rgba(0,0,0,0.5);
`;

export const StyledLink = styled(IndexLink).attrs({
  activeClassName: 'active'
})`
  border-bottom: ${pxToRem(3)} solid transparent;
  color: white;
  text-decoration: none;
  white-space: nowrap;

  &:hover,
  &:focus {
    border-bottom: ${pxToRem(3)} solid white;
  }
`;

export const StyledRedirect = styled.a`
  border-bottom: ${pxToRem(3)} solid transparent;
  color: white;
  text-decoration: none;
  white-space: nowrap;

  &:hover,
  &:focus {
    border-bottom: ${pxToRem(3)} solid white;
  }
`;

export const StyledCheckMarkWrapper = styled.span.attrs({
  role: 'img'
})`
  font-size: 0.75rem;
  margin: 0 0 0 1rem;

  .rtl & {
    margin: 0 1rem 0 0;
  }
`;

export const StyledCheckMark = styled.i`
  color: ${theme('mode', {
    light: zooTheme.colors.brand.default
  })};
  text-shadow: none;
`;

export const StyledUnderReview = styled.small`
  align-self: left;
  color: ${theme('mode', {
    light: zooTheme.colors.teal.light
  })};
  font-size: ${pxToRem(15)};
  text-transform: uppercase;
  white-space: nowrap;
`;


function ProjectTitle({ launched, link, redirect, title, underReview }) {
  const TitleComponent = (redirect) ? StyledRedirect : StyledLink;
  const zooniverseApprovedTranslation = counterpart('project.nav.zooniverseApproved');

  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <H1>
        {underReview && !launched &&
          <StyledUnderReview>{counterpart('project.nav.underReview')}</StyledUnderReview>}
        <TitleComponent to={link} href={redirect}>
          <span>
            {title}
            {redirect && <span>{' '}<i className="fa fa-external-link" /></span>}
          </span>
        </TitleComponent>
        {launched &&
          <StyledCheckMarkWrapper
            className="fa-stack"
            aria-label={zooniverseApprovedTranslation}
            title={zooniverseApprovedTranslation}
          >
            <i className="fa fa-circle fa-stack-2x" />
            <StyledCheckMark className="fa fa-check fa-stack-1x" />
          </StyledCheckMarkWrapper>
        }
      </H1>
    </ThemeProvider>
  );
}

ProjectTitle.defaultProps = {
  launched: false,
  link: '',
  redirect: '',
  title: '',
  underReview: false
};

ProjectTitle.propTypes = {
  launched: PropTypes.bool,
  link: PropTypes.string,
  redirect: PropTypes.string,
  title: PropTypes.string,
  underReview: PropTypes.bool
};

export default ProjectTitle;
