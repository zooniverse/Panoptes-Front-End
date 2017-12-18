import _ from 'lodash';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import socialIcons from '../../socialIcons';

const commonStyles = `
  color: white;
  display: block;
  font-family: Karla;
  font-size: 0.933333333rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 0.133333333rem 0.133333333rem rgba(0,0,0,0.22);
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
