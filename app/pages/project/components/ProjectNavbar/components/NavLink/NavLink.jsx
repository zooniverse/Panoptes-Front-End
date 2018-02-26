import _ from 'lodash';
import { Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { pxToRem } from '../../../../../../theme';
import ExternalLink from '../../../ExternalLinksBlock/components/ExternalLink';

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

export const StyledExternalLink = styled(ExternalLink)`
  color: white;
  ${commonStyles}
`;

export const StyledLinkPlaceholder = styled.span`
  color: lightgrey;
  cursor: not-allowed;
  ${commonStyles}
`;

function NavLink({ className, disabled, isExternalLink, label, url }) {
  const linkProps = {
    className,
    disabled
  };

  const LinkComponent = (disabled) ? StyledLinkPlaceholder : StyledInternalLink;

  if (!disabled) {
    linkProps.to = url;
  }

  if (isExternalLink) {
    return (
      <StyledExternalLink
        className={className}
        isExternalLink={isExternalLink}
        label={label}
        url={url}
      />
    );
  }

  return (
    <LinkComponent {...linkProps}>
      {label}
    </LinkComponent>
  );
}

NavLink.defaultProps = {
  className: '',
  disabled: false,
  isExternalLink: false,
  label: '',
  site: '',
  url: ''
};

NavLink.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isExternalLink: PropTypes.bool,
  label: PropTypes.string,
  site: PropTypes.string,
  url: PropTypes.string
};

export default NavLink;
