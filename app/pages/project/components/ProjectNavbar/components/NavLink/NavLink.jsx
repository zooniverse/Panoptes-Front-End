import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pxToRem } from '../../../../../../theme';
import socialIcons from '../../socialIcons';

const commonStyles = `
  display: block;
  font-family: Karla;
  font-size: ${pxToRem(15)};
  font-weight: bold;
  letter-spacing: ${pxToRem(1.5)};
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(2)} rgba(0,0,0,0.22);
  white-space: nowrap;
`;

export const StyledInternalLink = styled(Link).attrs({
  activeClassName: 'active'
})`
  color: white;
  ${commonStyles}
`;

export const StyledExternalLink = styled.a`
  color: white;
  ${commonStyles}
`;

export const StyledLinkPlaceholder = styled.span`
  color: lightgrey;
  cursor: not-allowed;
  ${commonStyles}
`;

function NavLink({ isExternalLink, isSocialLink, label, site, url, ...props }) {
  let iconClasses = '';
  const linkProps = _.clone(props);
  const LinkComponent = (isExternalLink) ? StyledExternalLink : StyledInternalLink;

  if (isExternalLink) {
    iconClasses = 'fa fa-external-link fa-fw';
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
    linkProps.href = url;
  } else {
    linkProps.to = url;
  }

  if (isSocialLink) {
    const icon = socialIcons[site].icon;
    linkProps['aria-label'] = socialIcons[site].label;
    iconClasses = `fa ${icon} fa-fw`;
  }

  if (linkProps.disabled) {
    return (
      <StyledLinkPlaceholder {...linkProps}>
        {label}
      </StyledLinkPlaceholder>
    );
  }

  return (
    <LinkComponent {...linkProps}>
      {!isSocialLink &&
        label}
      {iconClasses && <i className={iconClasses} />}
    </LinkComponent>
  );
}

NavLink.defaultProps = {
  isExternalLink: false,
  isSocialLink: false,
  label: '',
  site: '',
  url: ''
};

NavLink.propTypes = {
  isExternalLink: PropTypes.bool,
  isSocialLink: PropTypes.bool,
  label: PropTypes.string,
  site: PropTypes.string,
  url: PropTypes.string
};

export default NavLink;
