import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { socialIcons } from '../../../helpers';

export default function ExternalLink({ className, isExternalLink, isSocialLink, label, path, site, url }) {
  let iconClasses;
  let linkLabel = label;
  const linkProps = {
    className,
    href: url,
    rel: 'noopener noreferrer',
    target: '_blank'
  };

  if (isExternalLink) {
    iconClasses = 'fa fa-external-link fa-fw';
  }

  if (isSocialLink) {
    const icon = socialIcons[site].icon;
    linkProps['aria-label'] = socialIcons[site].ariaLabel;
    iconClasses = `fa ${icon} fa-fw`;
    linkLabel = path;
  }

  if (isExternalLink || isSocialLink) {
    return (
      <a {...linkProps}>
        {linkLabel}
        {iconClasses && <i className={iconClasses} />}
      </a>
    );
  }

  return null;
}

ExternalLink.defaultProps = {
  className: '',
  isExternalLink: false,
  isSocialLink: false,
  label: '',
  path: '',
  site: '',
  url: ''
};

ExternalLink.propTypes = {
  className: PropTypes.string,
  isExternalLink: PropTypes.bool.isRequired,
  isSocialLink: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string,
  site: PropTypes.string,
  url: PropTypes.string.isRequired
};
