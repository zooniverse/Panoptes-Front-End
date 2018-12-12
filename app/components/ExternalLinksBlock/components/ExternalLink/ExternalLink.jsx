import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from 'markdownz';
import { socialIcons } from '../../../../lib/nav-helpers';

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
    return (
      <div className={linkProps.className}>
        <Markdown tag="span" className="link-title" inline={true}>
          {`[${linkLabel}](+tab+${linkProps.href})`}
        </Markdown>
        {iconClasses && <i className={iconClasses} />}
      </div>
    );
  }

  if (isSocialLink) {
    const icon = socialIcons[site].icon;
    iconClasses = `fa ${icon} fa-fw`;
    linkLabel = path;
    linkProps['aria-label'] = socialIcons[site].ariaLabel;
    return (
      <a {...linkProps}>
        <span className="link-title">{linkLabel}</span>
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
