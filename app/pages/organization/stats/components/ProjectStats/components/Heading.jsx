import PropTypes from 'prop-types';
import React from 'react';
import { IndexLink } from 'react-router';
import styled from 'styled-components';

import Avatar from '../../../../../project/components/ProjectNavbar/components/Avatar';
import getCompleteness from '../helpers/getCompleteness';

const StyledHeading = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: .5em;
`;

export const StyledAvatar = styled(Avatar)`
  box-shadow: none;
  margin-right: .5em;
`;

export const StyledLink = styled(IndexLink)`
  border-bottom: 2px solid transparent;
  color: #5C5C5C;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 17px;
  text-decoration: none;
  text-transform: uppercase;

  &:hover,
  &:focus {
    border-bottom: 2px solid #5C5C5C;
  }
`;

export const StyledRedirect = styled.a`
  border-bottom: 2px solid transparent;
  color: #5C5C5C;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 17px;
  text-decoration: none;
  text-transform: uppercase;

  &:hover,
  &:focus {
    border-bottom: 2px solid #5C5C5C;
  }
`;

const StyledTitle = styled.h4`
  color: #5C5C5C;
  letter-spacing: 1.5px;
  line-height: 17px;
  text-transform: uppercase;
`;

export const StyledPercent = styled.span`
  color: #5C5C5C;
  margin-left: auto;
  font-weight: bold;
  font-size: .8em;
`;

function Heading({ resource, title }) {
  let TitleComponent = StyledTitle;
  let projectLink;

  if (resource.slug) {
    if (resource.redirect) {
      TitleComponent = StyledRedirect;
      projectLink = resource.redirect;
    } else {
      TitleComponent = StyledLink;
      projectLink = `/projects/${resource.slug}`;
    }
  }

  const hideStat = resource && resource.configuration && resource.configuration.stats_hidden;

  const completeness = getCompleteness(resource);

  return (
    <StyledHeading>
      {resource.avatarSrc && (
        <StyledAvatar
          src={resource.avatarSrc}
          projectTitle={resource.display_name}
          size={40}
        />
      )}
      <TitleComponent
        to={projectLink}
        href={resource.redirect}
      >
        {title}
        {resource.redirect && (
          <span>
            {' '}
            <i className="fa fa-external-link" />
          </span>
        )}
      </TitleComponent>
      {!hideStat && (
        <StyledPercent>{`${Math.floor(completeness * 100)}%`}</StyledPercent>
      )}
    </StyledHeading>
  );
}

Heading.propTypes = {
  resource: PropTypes.shape({
    avatarSrc: PropTypes.string,
    completeness: PropTypes.number,
    configuration: PropTypes.shape({
      stats_hidden: PropTypes.bool
    }),
    display_name: PropTypes.string,
    redirect: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default Heading;
