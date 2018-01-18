import _ from 'lodash';
import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { pxToRem } from '../../../../../../theme';
import socialIcons from '../../socialIcons';

const commonStyles = `
  color: white;
  display: block;
  font-family: Karla;
  font-size: ${pxToRem(15)};
  font-weight: bold;
  letter-spacing: ${pxToRem(1.5)};
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 ${pxToRem(2)} ${pxToRem(2)} rgba(0,0,0,0.22);
`;

const StyledInternalLink = styled(Link).attrs({
  activeClassName: 'active'
})`
  ${commonStyles}
`;

const StyledExternalLink = styled.a`
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
    linkProps.to = `${url}?facelift=true`;
  }

  if (isSocialLink) {
    const icon = socialIcons[site].icon;
    linkProps['aria-label'] = socialIcons[site].label;
    iconClasses = `fa ${icon} fa-fw`;
  }

  return (
    <LinkComponent {...linkProps}>
      {label}
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
